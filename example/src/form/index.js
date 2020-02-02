'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

//Packages
//Contexts
var FormContext = React.createContext([]);
//# sourceMappingURL=FormContext.js.map

//Form class
function Form(props) {
    //-------------------------------------------------
    // Properties
    //-------------------------------------------------
    //states
    var _a = props.data ? props.data : React.useState(props.initialdata || {}), form = _a[0], setForm = _a[1];
    //-------------------------------------------------
    // Effects
    //-------------------------------------------------
    React.useEffect(function () {
        if (props.onChange)
            props.onChange(form);
    }, [form]);
    //-------------------------------------------------
    // Functions
    //-------------------------------------------------
    var onSubmit = React.useCallback(function (event) {
        //Prevent the page from reloading
        event.preventDefault();
        //Check if the parent wants to know
        if (!("onSubmit" in props))
            return;
        //Check if form is carrying a file
        var value;
        if (props.file) {
            value = new FormData();
            for (var field in form) {
                if (form[field]) {
                    value.append(field, form[field]);
                }
            }
        }
        else {
            value = {};
            for (var field in form) {
                if (form[field]) {
                    value[field] = form[field];
                }
            }
        }
        //Get value from the form
        value = props.onSubmit(value);
        //Wait for promise response
        if (value instanceof Promise) {
            value.then(function (response) {
                if (response === false)
                    setForm({});
            });
        }
        else if (value === false)
            setForm({});
    }, []);
    //-------------------------------------------------
    // Render
    //-------------------------------------------------
    return (React.createElement(FormContext.Provider, { value: [form, setForm] },
        React.createElement("form", __assign({}, props, { encType: (props.file ? "multipart/form-data" : undefined), onSubmit: onSubmit }), props.children)));
}
//# sourceMappingURL=Form.js.map

//Packages
//Contexts
var GroupContext = React.createContext("");
//# sourceMappingURL=GroupContext.js.map

//Group class
function Group(props) {
    //-------------------------------------------------
    // Properties
    //-------------------------------------------------
    var context = React.useContext(GroupContext);
    var position = context ? (context + "." + props.name) : props.name;
    //-------------------------------------------------
    // Render
    //-------------------------------------------------
    return (React.createElement(GroupContext.Provider, { value: position },
        React.createElement("div", __assign({}, props), props.children)));
}
//# sourceMappingURL=Group.js.map

function dig(obj, path, value) {
    var pList = path.split('.');
    var len = pList.length;
    var context = obj;
    for (var i = 0; i < len - 1; i++) {
        var elem = pList[i];
        if (!(elem in context))
            context[elem] = {};
        context = context[elem];
    }
    if (value !== null && value !== undefined) {
        context[pList[len - 1]] = value;
        return obj;
    }
    else {
        return context[pList[len - 1]] === null ? "" : context[pList[len - 1]];
    }
}
//# sourceMappingURL=dig.js.map

function filters(value, filterslist) {
    var initialvalue = value;
    //List not initialized
    if (filterslist === undefined)
        return initialvalue;
    //Loop all the filters
    for (var i = 0; i < filterslist.length; i++) {
        initialvalue = filterslist[i](initialvalue);
    }
    return initialvalue;
}
//# sourceMappingURL=filters.js.map

//Input class
function Input(props) {
    //-------------------------------------------------
    // Properties
    //-------------------------------------------------
    //Contexts
    var _a = React.useContext(FormContext), form = _a[0], setForm = _a[1];
    var context = React.useContext(GroupContext);
    var position = context ? (context + "." + props.name) : props.name;
    //-------------------------------------------------
    // Functions
    //-------------------------------------------------
    var onChange = React.useCallback(function (event) {
        //Get raw value
        var localvalue = filters(event.target.value, props.filters);
        //Check if the user wants to edit it
        if (props.onChange)
            localvalue = props.onChange(localvalue, event);
        //Set it in the context
        var updatedform = __assign({}, form);
        updatedform = dig(updatedform, position, localvalue);
        //Update values
        setForm(updatedform);
    }, [form, props.onChange]);
    //-------------------------------------------------
    // Memos
    //-------------------------------------------------
    var value = React.useMemo(function () {
        return dig(form, position) || "";
    }, [form]);
    //-------------------------------------------------
    // Render
    //-------------------------------------------------
    return (React.createElement("input", __assign({}, props, { value: value, onChange: onChange })));
}

//Textarea class
function Text(props) {
    //-------------------------------------------------
    // Properties
    //-------------------------------------------------
    //Contexts
    var _a = React.useContext(FormContext), form = _a[0], setForm = _a[1];
    var context = React.useContext(GroupContext);
    //Consts
    var position = context ? (context + "." + props.name) : props.name;
    var value = dig(form, position) || "";
    //-------------------------------------------------
    // Functions
    //-------------------------------------------------
    var onChange = React.useCallback(function (node) {
        //Get raw value
        var _value = filters(node.target.value, props.filters);
        //Check if the user wants to edit it
        if (props.onChange)
            _value = props.onChange(_value, node);
        //Set it in the context
        var updatedform = __assign({}, form);
        updatedform = dig(updatedform, position, _value);
        //Update values
        setForm(updatedform);
    }, [form, props.onChange]);
    //-------------------------------------------------
    // Render
    //-------------------------------------------------
    return (React.createElement("textarea", __assign({}, props, { value: value, onChange: onChange })));
}
//# sourceMappingURL=Text.js.map

//Toggle class
function Toggle(props) {
    //-------------------------------------------------
    // Properties
    //-------------------------------------------------
    var _a = React.useContext(FormContext), form = _a[0], setForm = _a[1];
    var context = React.useContext(GroupContext);
    var position = context ? (context + "." + props.name) : props.name;
    var finalvalue = dig(form, position);
    //-------------------------------------------------
    // Functions
    //-------------------------------------------------
    var onChange = React.useCallback(function (node) {
        //Get raw value
        var value = filters(!finalvalue, props.filters);
        //Check if the user wants to edit it
        if (props.onChange)
            value = props.onChange(value, node);
        //Set it in the context
        var updatedform = __assign({}, form);
        updatedform = dig(updatedform, position, value);
        //Update form
        setForm(updatedform);
    }, [form, props]);
    //-------------------------------------------------
    // Render
    //-------------------------------------------------
    return (React.createElement("input", __assign({}, props, { type: "checkbox", checked: !!finalvalue, onChange: onChange })));
}
//# sourceMappingURL=Toggle.js.map

//Input class
function Select(props) {
    //-------------------------------------------------
    // Properties
    //-------------------------------------------------
    //Contexts
    var _a = React.useContext(FormContext), form = _a[0], setForm = _a[1];
    var context = React.useContext(GroupContext);
    var position = context ? (context + "." + props.name) : props.name;
    //-------------------------------------------------
    // Functions
    //-------------------------------------------------
    var onChange = React.useCallback(function (node) {
        //Get raw value
        var localvalue = filters(node.target.value, props.filters);
        //Check if the user wants to edit it
        if (props.onChange)
            localvalue = props.onChange(localvalue, node);
        //Set it in the context
        var updatedform = __assign({}, form);
        updatedform = dig(updatedform, position, localvalue);
        //Update values
        setForm(updatedform);
    }, [form, props.onChange]);
    //-------------------------------------------------
    // Memos
    //-------------------------------------------------
    var value = React.useMemo(function () {
        return dig(form, position);
    }, [form]);
    //-------------------------------------------------
    // Render
    //-------------------------------------------------
    return (React.createElement("select", __assign({}, props, { value: value, onChange: onChange }), props.children));
}
//# sourceMappingURL=Select.js.map

//Wrapper helps you give functionality to any component
function Wrapper(props) {
    //-------------------------------------------------
    // Properties
    //-------------------------------------------------
    //contexts
    var _a = React.useContext(FormContext), form = _a[0], setForm = _a[1];
    var context = React.useContext(GroupContext);
    var position = context ? (context + "." + props.name) : props.name;
    //-------------------------------------------------
    // Effects
    //-------------------------------------------------
    React.useEffect(function () {
        //Set it in the context
        var updatedform = __assign({}, form);
        var updatedvalue = filters(props.value, props.filters);
        updatedform = dig(updatedform, position, updatedvalue);
        //Update values
        setForm(updatedform);
    }, [props.value]);
    //-------------------------------------------------
    // Render
    //-------------------------------------------------
    return (props.children);
}
//# sourceMappingURL=Wrapper.js.map

//Modules components
//Separated components
var Form$1 = Form;
var Group$1 = Group;
var Input$1 = Input;
var Text$1 = Text;
var Toggle$1 = Toggle;
var Select$1 = Select;
var Wrapper$1 = Wrapper;
//Bundled
var bundled = {
    //Components
    Form: Form,
    Group: Group,
    Input: Input,
    Text: Text,
    Toggle: Toggle,
    Select: Select,
    Wrapper: Wrapper,
};
//# sourceMappingURL=index.js.map

exports.Form = Form$1;
exports.Group = Group$1;
exports.Input = Input$1;
exports.Text = Text$1;
exports.Toggle = Toggle$1;
exports.Select = Select$1;
exports.Wrapper = Wrapper$1;
exports.default = bundled;
//# sourceMappingURL=index.js.map