import addStateToTemplate from 'meteor/cristo:state-in-templates';
import {Template} from 'meteor/templating';
import {Tracker} from 'meteor/tracker';
import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import jQuery from 'jquery';

addStateToTemplate(Template.universeDateTiles);

Template.universeDateTiles.onCreated(function () {
    const {
        currentDate,
        selectedDate,
        dayFormat = 'D',
        mothFormat = 'MMMM',
        yearFormat = 'YYYY',
        dateFormat = 'MMM Do YYYY'
    } = this.data || {};
    Object.assign(this, {dayFormat, mothFormat, yearFormat, dateFormat});
    this.state.setDefault({
        currentDate: moment(currentDate || new Date()).startOf('day').toDate(),
        selectedDate,
        animateClass: '',
        tails: []
    });

    this.changeSelectedDate = (date) => {
        const selectedDate = moment(date).startOf('day').toDate();
        if (triggerEvent(this, 'change', selectedDate)) {
            this.state.set('selectedDate', selectedDate);
        }
    };

    this.navigateToSelected = () => Tracker.nonreactive(() => {
        const selectedDate = this.state.get('selectedDate') || new Date();
        this.state.set('currentDate', selectedDate);
    });

    const navigateToDate = (direction, step) => {
        let newDate = null;
        let animateClass = 'js-move-prev';
        Tracker.nonreactive(() => {
            if (direction === 'next') {
                newDate = moment(this.state.get('currentDate')).add(1, step).toDate();
                animateClass = 'js-move-next';
            } else {
                newDate = moment(this.state.get('currentDate')).subtract(1, step).toDate();
            }
        });

        if (triggerEvent(this, 'navigateToDate', {newDate, direction, step})) {
            if (step === 'day') {
                this.state.set('animateClass', animateClass);
                return Meteor.setTimeout(() => {
                    this.state.set('currentDate', newDate);
                    this.state.set('animateClass', '');
                }, 400);
            }
            this.state.set('currentDate', newDate);
        }
    };
    this.navigateToNextYear = () => navigateToDate('next', 'year');
    this.navigateToPrevYear = () => navigateToDate('prev', 'year');
    this.navigateToNextMonth = () => navigateToDate('next', 'month');
    this.navigateToPrevMonth = () => navigateToDate('prev', 'month');
    this.navigateToNextDay = () => navigateToDate('next', 'day');
    this.navigateToPrevDay = () => navigateToDate('prev', 'day');
});

Template.universeDateTiles.onRendered(function () {
    this.autorun(() => {
        const count = Math.ceil(this.$(this.firstNode).width()/70) + 2;
        const beforeDays = Math.round(count/2) - 1;
        let date = moment(this.state.get('currentDate')).subtract(beforeDays, 'd');
        let selectedDate = this.state.get('selectedDate');
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push({
                day: date.format(this.dayFormat),
                month: date.format(this.mothFormat),
                year: date.format(this.yearFormat),
                date: date.toDate(),
                isSelected: selectedDate && date.isSame(selectedDate, 'day')
            });
            date = moment(date).add(1, 'd');
        }
        this.state.set('tails', arr);
    });
    this.getState = () => this.state;
});

Template.universeDateTiles.helpers({
    getData () {
        const tmpl = Template.instance();
        const m = moment(tmpl.state.get('currentDate'));
        return {year: m.format(tmpl.yearFormat), month: m.format(tmpl.mothFormat)};
    },
    getSelectedDate () {
        const tmpl = Template.instance();
        const selected = tmpl.state.get('selectedDate');
        if (selected) {
            return moment(selected).format(tmpl.dateFormat);
        }
    },
    getContentContext () {
        const {
            dayFormat,
            mothFormat,
            yearFormat,
            dateFormat,
            getState,
            state
        } = Template.instance();
        return {
            selectedDate: state.get('selectedDate'),
            currentDate: state.get('currentDate'),
            dayFormat,
            mothFormat,
            yearFormat,
            dateFormat,
            getState
        };
    }
});

Template.universeDateTiles.events({
    'click .js-next-year': (e, tmpl) => tmpl.navigateToNextYear(),
    'click .js-prev-year': (e, tmpl) => tmpl.navigateToPrevYear(),
    'click .js-next-month': (e, tmpl) => tmpl.navigateToNextMonth(),
    'click .js-prev-month': (e, tmpl) => tmpl.navigateToPrevMonth(),
    'click .js-next-day': (e, tmpl) => tmpl.navigateToNextDay(),
    'click .js-prev-day': (e, tmpl) => tmpl.navigateToPrevDay(),
    'click .js-goto-selected': (e, tmpl) => tmpl.navigateToSelected(),
    'click .js-select-tile' (e, {changeSelectedDate}) {
        changeSelectedDate(this.date);
    }
});



function triggerEvent (template, type, params = {}, cb) {
    if (template && template.$) {
        let event = jQuery.Event(type);
        jQuery(template.firstNode).trigger(event, [params]);
        if (typeof cb === 'function') {
            cb(event);
        }
        return !event.isDefaultPrevented();
    }
}

const {AutoForm} = Package['aldeed:autoform'] || {};

if (AutoForm) {
    addStateToTemplate(Template.afUniverseDateTiles);
    AutoForm.addInputType('universeDateTiles', {
        template: 'afUniverseDateTiles',
        valueOut () {
            const {state} = Blaze.getView(this[0]).templateInstance();
            return state ? state.get('selectedDate') : undefined;
        }
    });
}
