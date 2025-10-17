<%*
// Default setup
const {title, filename, frontmatter} = await tp.user.noteSetup_default(tp);

frontmatter['tags'].push("note/piranha-quest");
frontmatter['completed'] = false;

// Assign frontmatter after execution
tp.hooks.on_all_templates_executed(async () => {
	await tp.user.assignFrontmatter(tp, frontmatter);
});
-%>
# <%* tR += title %>?
_additionally expand on what the outcome of this quest should be_
## Conclusion(s)
_what is the overall conclusion on this question quest?_
## 1. Sub question
_ask and answer sub questions chronologically separated by headers. It can help to prefix sub-questions with a number to identify trains of thought 1., 1.1, 2., etc._