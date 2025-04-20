
const FILE_FORMAT_DAY = 'YYYY-MM-DD';
const LINK_FORMAT_DAY = FILE_FORMAT_DAY;

const FILE_FORMAT_WEEK = 'YYYY-[W]WW';
const LINK_FORMAT_WEEK = `${FILE_FORMAT_WEEK}|[Week] W`;

const FILE_FORMAT_MONTH = 'YYYY-MM';
const LINK_FORMAT_MONTH = `${FILE_FORMAT_MONTH}|MMMM`;

const FILE_FORMAT_QUARTER = 'YYYY-[Q]Q';
const LINK_FORMAT_QUARTER = `${FILE_FORMAT_QUARTER}|[Q]Q`;

const FILE_FORMAT_YEAR = 'YYYY';
const LINK_FORMAT_YEAR = FILE_FORMAT_YEAR;

function getPeriodicNoteFilenamesFromDate (mDate) {
    return {
        day: mDate.format(FILE_FORMAT_DAY),
        week: mDate.format(FILE_FORMAT_WEEK),
        month: mDate.format(FILE_FORMAT_MONTH),
        quarter: mDate.format(FILE_FORMAT_QUARTER),
        year: mDate.format(FILE_FORMAT_YEAR),
    };
}

function getPeriodicNoteLinkTextFromDate (mDate) {
    return {
        day: mDate.format(LINK_FORMAT_DAY),
        week: mDate.format(LINK_FORMAT_WEEK),
        month: mDate.format(LINK_FORMAT_MONTH),
        quarter: mDate.format(LINK_FORMAT_QUARTER),
        year: mDate.format(LINK_FORMAT_YEAR),
    };
}

function getQuartersInYearLinkText(mYear) {
    const quarter = mYear.clone();
    return [
        quarter.format(LINK_FORMAT_QUARTER),
        quarter.add(1, 'quarters').format(LINK_FORMAT_QUARTER),
        quarter.add(1, 'quarters').format(LINK_FORMAT_QUARTER),
        quarter.add(1, 'quarters').format(LINK_FORMAT_QUARTER),
    ]
}

function getMonthsInQuarterLinkText(mQuarter) {
    const month = mQuarter.clone();
    return [
        month.format(LINK_FORMAT_MONTH),
        month.add(1, 'months').format(LINK_FORMAT_MONTH),
        month.add(1, 'months').format(LINK_FORMAT_MONTH),
    ]
}

function getWeeksInMonthLinkText(mMonth) {
    const week = mMonth.clone();
    const thisMonth = mMonth.month();

    week.startOf('week');
    let linkTexts = [week.format(LINK_FORMAT_WEEK)];
    week.add(1, 'weeks');
    for (; week.month() == thisMonth; week.add(1, 'weeks')) {
        linkTexts.push(week.format(LINK_FORMAT_WEEK));
    }
    return linkTexts;
}

function getDaysInWeekLinkText(mWeek) {
    linkTexts = [];
    for (let day = 1; day <= 7; ++day) {
        linkTexts.push(mWeek.isoWeekday(day).format(`${FILE_FORMAT_DAY}|dddd`));
    }
    return linkTexts;
}

module.exports = () => {
    return {
        FILE_FORMAT_DAY,
        FILE_FORMAT_WEEK,
        FILE_FORMAT_MONTH,
        FILE_FORMAT_QUARTER,
        FILE_FORMAT_YEAR,

        LINK_FORMAT_DAY,
        LINK_FORMAT_WEEK,
        LINK_FORMAT_MONTH,
        LINK_FORMAT_QUARTER,
        LINK_FORMAT_YEAR,

        getPeriodicNoteFilenamesFromDate,
        getPeriodicNoteLinkTextFromDate,
        getQuartersInYearLinkText,
        getMonthsInQuarterLinkText,
        getWeeksInMonthLinkText,
        getDaysInWeekLinkText,
    };
};