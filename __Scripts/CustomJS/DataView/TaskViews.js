
class TaskViews {
    Builder = class TaskViewBuilder {
        static TASK_METAINFO_FIELD = 'myobs_metaInfo';
        static INITIATIVE_TAG = 'note/initiative';
        static PROJECT_TAG = 'note/project';

        static NOTHING_TO_DISPLAY_TEXT = 'TaskViewBuilder: nothing to display';
        static NO_PROJECT_TEXT = 'No Project';
        static NO_INITIATIVE_TEXT = 'No Initiative';

        constructor(dv) {
            this.dv = dv;
            this.noteType = "";
            this.notes = null;
            this.tasks = null;
        }

        /// Error checking ///
        checkIfNotesExist(enforceLength = false) {
            if (!this.notes) {
                throw new Error('Notes list wasnt populated. Please call either getInitiatives() or getProjects() first.');
            } else if (enforceLength && this.notes.length === 0) {
                throw new Error(`No #${this.noteType} notes to draw from.`);
            }
        }

        checkIfTasksExist(enforceLength = false) {
            if (!this.tasks) {
                throw new Error('Tasks list wasnt populated. Please call function to get tasks first.');
            } else if (enforceLength && this.tasks.length === 0) {
                throw new Error('No Tasks to draw from.');
            }
        }

        checkNoteType(noteType) {
            if (this.noteType !== noteType) {
                throw new Error(`List must be of type #${noteType} to display this view.`)
            }
        }

        /// Note helpers ///
        getInitiativeInfoFromProject(project) {
            let initiative = project.initiative ? this.dv.page(project.initiative) : null;
            let initiativeLink = initiative?.file.link ?? TaskViewBuilder.NO_INITIATIVE_TEXT;
            return { initiative, initiativeLink };
        }

        decorateTasksWithMetaInfo(tasks) {
            tasks.forEach(task => {
                const parent = this.dv.page(task.link);
                let project = null;
                let projectLink = TaskViewBuilder.NO_PROJECT_TEXT;
                let initiative = null;
                let initiativeLink = TaskViewBuilder.NO_INITIATIVE_TEXT;

                if (parent && parent.file.tags.includes(`#${TaskViewBuilder.INITIATIVE_TAG}`)) {
                    initiative = parent;
                    initiativeLink = initiative?.file.link ?? initiativeLink;
                }
                else if (parent && parent.file.tags.includes(`#${TaskViewBuilder.PROJECT_TAG}`)) {
                    project = parent;
                    projectLink = project?.file.link ?? projectLink;
                    ({ initiative, initiativeLink } = this.getInitiativeInfoFromProject(project));
                }

                task[TaskViewBuilder.TASK_METAINFO_FIELD] = {
                    project,
                    projectLink,
                    initiative,
                    initiativeLink
                };
            });
        }

        /// Builder functions: Notes ///
        getInitiatives() {
            this.noteType = TaskViewBuilder.INITIATIVE_TAG;
            this.notes = this.dv.pages(`#${TaskViewBuilder.INITIATIVE_TAG}`);
            return this;
        }

        getProjects(fromInitiative = null) {
            this.noteType = TaskViewBuilder.PROJECT_TAG;
            this.notes = this.dv.pages(`#${TaskViewBuilder.PROJECT_TAG}`);
            if (fromInitiative) {
                this.notes = this.notes.where(p =>
                    p?.initiative?.equals && p?.initiative?.equals(fromInitiative?.file?.link)
                );
            }
            return this;
        }

        withNoInitiative() {
            this.checkIfNotesExist();

            this.notes = this.notes.where(p => !p.initiative);

            return this;
        }

        /// Builder functions: Tasks ///
        getAllTasks(fromInitiative = null) {
            if (fromInitiative) {
                this.getProjects(fromInitiative);
                this.getTasks();
                this.tasks.concat(fromInitiative.file.tasks);
                this.notes = null;
                this.noteType = "";
            }
            else {
                this.tasks = this.dv.pages(`#${TaskViewBuilder.PROJECT_TAG}`)?.file?.tasks ?? [];
                this.tasks.concat(this.dv.pages(`#${TaskViewBuilder.INITIATIVE_TAG}`)?.file?.tasks ?? []);
            }

            return this;
        }

        getTasks() {
            this.checkIfNotesExist();
            this.tasks = this.notes.file.tasks;
            this.notes = null;
            this.noteType = "";

            return this;
        }

        hideCompleted() {
            this.checkIfTasksExist();
            this.tasks = this.tasks
                .where(t => !t.completed);

            return this;
        }

        /// Builder functions: Universal ///

        // Filter by tag (without #) can specify list of tags that must be included and excluded
        filterByTags(includedTags, excludedTags) {
            if (includedTags) {
                includedTags = Array.isArray(includedTags) ? includedTags : [includedTags];
            } else { includedTags = [] }

            if (excludedTags) {
                excludedTags = Array.isArray(excludedTags) ? excludedTags : [excludedTags];
            } else { excludedTags = [] }

            if (this.notes) {
                this.notes = this.notes.where(p =>
                    includedTags.every(tag => p.file.tags.includes(`#${tag}`))
                    && excludedTags.every(tag => !p.file.tags.includes(`#${tag}`))
                );
            }

            if (this.tasks) {
                this.tasks = this.tasks.where(p =>
                    includedTags.every(tag => this.dv.func.contains(p.file.tags, `#${tag}`))
                    && excludedTags.every(tag => !this.dv.func.contains(p.file.tags, `#${tag}`))
                );
            }

            return this;
        }

        // Filter notes/tags by status (accepts a string or array of strings)
        filterByStatus(inStatuses) {
            const statuses = Array.isArray(inStatuses) ? inStatuses : [inStatuses];

            if (this.notes) {
                this.notes = this.notes.where(p => statuses.includes(p.status));
            }

            if (this.tasks) {
                this.tasks = this.tasks.where(t => statuses.includes(t.status));
            }

            return this;
        }

        defaultSort(descending = false) {
            if (this.notes) {
                this.notes = this.notes.sort(p => p.file.name, descending ? "desc" : "asc");
            }

            if (this.tasks) {
                this.tasks = this.tasks.sort(t => t.text, descending ? "desc" : "asc");
            }

            return this;
        }

        /// View functions ///
        simpleListView() {
            this.checkIfNotesExist();
            if (this.notes.length === 0) {
                this.dv.paragraph(TaskViewBuilder.NOTHING_TO_DISPLAY_TEXT);
                return;
            }

            this.dv.list(this.notes.file.link);
        }

        initiativeOrganizedListView(noInitiativeShownFirst = true) {
            this.checkNoteType(TaskViewBuilder.PROJECT_TAG);
            this.checkIfNotesExist();

            let result = Object.groupBy(this.notes,
                note => {
                    let { _, initiativeLink } = this.getInitiativeInfoFromProject(note);
                    return initiativeLink;
                }
            );
            let resultEntries = Object.entries(result);

            if (resultEntries.length === 0) {
                this.dv.paragraph(TaskViewBuilder.NOTHING_TO_DISPLAY_TEXT);
                return;
            }

            if (noInitiativeShownFirst && result[TaskViewBuilder.NO_INITIATIVE_TEXT]) {
                this.dv.header(4, TaskViewBuilder.NO_INITIATIVE_TEXT);
                this.dv.list(result[TaskViewBuilder.NO_INITIATIVE_TEXT].map(note => note.file.link));
            }

            for (const [initiativeLink, notes] of resultEntries) {
                if (initiativeLink === TaskViewBuilder.NO_INITIATIVE_TEXT) continue;
                this.dv.header(4, initiativeLink);
                this.dv.list(notes.map(note => note.file.link));
            }

            if (!noInitiativeShownFirst && result[TaskViewBuilder.NO_INITIATIVE_TEXT]) {
                this.dv.header(4, TaskViewBuilder.NO_INITIATIVE_TEXT);
                this.dv.list(result[TaskViewBuilder.NO_INITIATIVE_TEXT].map(note => note.file.link));
            }
        }

        simpleTaskView(showProject = false, showInitiative = false) {
            this.checkIfTasksExist();
            if (this.tasks.length === 0) {
                this.dv.paragraph(TaskViewBuilder.NOTHING_TO_DISPLAY_TEXT);
                return;
            }


            if (showProject || showInitiative) {
                this.decorateTasksWithMetaInfo(this.tasks);
                this.tasks.forEach(task => {
                    const { initiativeLink, projectLink } = task[TaskViewBuilder.TASK_METAINFO_FIELD];

                    task.visual = showInitiative ? `(${initiativeLink}) ` : "";
                    task.visual += showProject ? `${projectLink}:` : "";
                    task.visual += showProject || showInitiative ? "\n" : "";
                    task.visual += task.text;
                });
            }
            this.dv.taskList(this.tasks, false);
        }

        projectOrganizedTaskView(showInitiative = false) {
            this.checkIfTasksExist();
            if (this.tasks.length === 0) {
                this.dv.paragraph(TaskViewBuilder.NOTHING_TO_DISPLAY_TEXT);
                return;
            }

            this.decorateTasksWithMetaInfo(this.tasks);
            let result = Object.groupBy(this.tasks,
                task => {
                    const { initiativeLink, projectLink } = task[TaskViewBuilder.TASK_METAINFO_FIELD];
                    let header = showInitiative ? `${initiativeLink} > ` : "";
                    header += `${projectLink}`;
                    return header;
                }
            );
            let resultEntries = Object.entries(result);

            for (const [header, tasks] of resultEntries) {
                this.dv.header(4, header);
                this.dv.taskList(tasks, false);
            }
        }
    }
}
