var Components = (function (exports) {
    'use strict';

    class ComponentBase extends HTMLElement {
        _props;

        constructor() {
            super();
            this._props = {};
            this.attachShadow({mode: 'open'});
        }

        get props() {
            return this._props;
        }

        /**
         * @param {object} value
         */
        set props(value) {
            this._props = value;
        }

        render() {
            this.appendStyle();
            this.appendContent();
            this.onRender();
        }

        appendContent() {
            let content = this.content();
            if (content instanceof Node) {
                this.shadowRoot.append(content);
            }
            else if (Array.isArray(content)) {
                content.forEach(content => {
                    if (content instanceof Node) {
                        this.shadowRoot.append(content);
                    }
                });
            }
        }

        appendStyle() {
            let style = this.shadowRoot.appendChild(document.createElement('style'));
            style.textContent = this.styleText();
        }

        content() { return null; }

        styleText() { return ''; }

        onRender() {}

        connectedCallback() {
            if (!this.rendered) {
                this.render();
                this.rendered = true;
              }
        }
    }

    class InputLabel extends ComponentBase {
        constructor() {
            super();
            this._props = { label: '' };
        }

        styleText() {
            return `:host {
            font-size: 18px;
            font-weight: 500;
            margin: auto 3px 2px auto;
            vertical-align: baseline;   
        }`; 
        }

        content() {
            let label = document.createElement('label');
            label.className = 'input-label';
            label.append(document.createTextNode(this._props.label));
            return label;
        }
    }

    class InputBase extends ComponentBase {
        get value() {
            return this.shadowRoot.querySelector('.input-control').value;
        }

        styleText() {
            return `.input-control {
            border: solid 1px rgba(0,0,0,0.2);
            border-radius: 5px;
            background-color: inherit;
            font-size: 18px;
            padding: 4px 6px;
        } `
        }
    }

    class InputSelect extends InputBase {
        constructor() {
            super();
            this._props = { options: [], handleChange: () => {}};
        }

        content() {
            const select = document.createElement('select');
            select.className = 'input-control';
            select.addEventListener('change', this._props.handleChange);
            
            this._props.options.forEach(o => {
                let option = select.appendChild(document.createElement('option'));
                option.setAttribute('label', o.label);
                option.setAttribute('value', o.value);
                if (this._props.value == o.value) {
                    option.selected = true;
                }
            });

            return select;
        }
    }

    class InputText extends InputBase {
        content() {
            let input = document.createElement('input');
            input.className = 'input-control';
            input.value = this._props.value;
            input.setAttribute('type', 'text');
            return input;
        }
    }

    const createComponent = (tagName, props) => {
        let component = document.createElement(tagName);
        component.props = props;
        return component;
    };

    class FormField extends ComponentBase {
        _input;

        constructor() {
            super();
        }

        styleText() {
            return `div {
            display: flex;
            flex-flow: row nowrap;
            padding: 6px;
        }`;
        }

        content() {
            this.setAttribute('name', this._props.name);
            this._input = createComponent(this._props.inputTagName, this._props);
            return [
                createComponent('input-label', this._props),
                this._input
            ];
        }

        toModel() {
            return {
                name: this._props.name,
                value: this._input.value
            }
        }
    }

    class InputNumber extends InputText {
        onRender() {
            let control = this.shadowRoot.querySelector('.input-control');
            control.style.width = control.value?.length || '10px';
            control.addEventListener('input', (event) => {
                control.style.width = `${event.target.value.length * 10}px`;
            });
        }
    }

    const ButtonNames$1 = Object.freeze({
        BlockAfter: 'btn-block-after',
        BlockBefore: 'btn-block-before',
        BlockRemove: 'btn-block-remove'
    });

    const CommandNames = Object.freeze({
        HoldExecution: 'hold',
        Move: 'move',
        MoveInMachineCoords: 'movemachine',
        Pause: 'pause',
        Probe: 'probe',
        SetCoordSystem: 'coordsystem',
        SetDistance: 'distance',
        SetSpindle: 'spindle',
        SetUnits: 'units'
    });

    const EventNames$1 = Object.freeze({
        BlockAfter: 'blockafter',
        BlockBefore: 'blockbefore',
        BlockRemove: 'blockremove',
        CommandChanged: 'commandchanged',
        MoveModeChanged: 'movemodechanged',
        SpindleModeChanged: 'spindlemodechanged'
    });

    const FieldNames$1 = Object.freeze({
        Command: 'command',
        MacroTitle: 'macrotitle',
        CoordSystem: 'coordsystem',
        DistanceMode: 'distancemode',
        FeedRate: 'feedrate',
        MoveMode: 'movemode',
        ProbeMode: 'probemode',
        SpindleMode: 'spindlemode',
        SpindleSpeed: 'spindlespeed',
        Time: 'time',
        UnitsMode: 'unitsmode',
        X: 'x',
        Y: 'y',
        Z: 'z'
    });

    const TagNames$1 = Object.freeze({
        CloseIcon: 'close-icon',
        FormField: 'form-field',
        IconButton: 'icon-btn',
        InputLabel: 'input-label',
        InputNumber: 'input-number',
        InputSelect: 'input-select',
        InputText: 'input-text',
        MacroFormBlock: 'macro-form-block',
        MacroFormBlockButtons: 'macro-form-block-btns',
        MacroFormBlockFields: 'macro-form-block-fields',
        MacroFormBlocks: 'macro-form-blocks',
        MacroForm: 'macro-form'
    });

    const ButtonNames = Object.freeze({
        BlockAfter: 'btn-block-after',
        BlockBefore: 'btn-block-before',
        BlockRemove: 'btn-block-remove'
    });

    const Commands = Object.freeze({
        HoldExecution: 'hold',
        Move: 'move',
        MoveInMachineCoords: 'movemachine',
        Pause: 'pause',
        Probe: 'probe',
        SetCoordSystem: 'coordsystem',
        SetDistance: 'distance',
        SetSpindle: 'spindle',
        SetUnits: 'units'
    });

    const EventNames = Object.freeze({
        BlockAfter: 'blockafter',
        BlockBefore: 'blockbefore',
        BlockRemove: 'blockremove',
        CommandChanged: 'commandchanged'
    });

    const FieldNames = Object.freeze({
        Command: 'command',
        MacroTitle: 'macrotitle',
        CoordSystem: 'coordsystem',
        DistanceMode: 'distancemode',
        FeedRate: 'feedrate',
        MoveMode: 'movemode',
        ProbeMode: 'probemode',
        SpindleMode: 'spindlemode',
        SpindleSpeed: 'spindlespeed',
        Time: 'time',
        UnitsMode: 'unitsmode',
        X: 'x',
        Y: 'y',
        Z: 'z'
    });

    const TagNames = Object.freeze({
        CloseIcon: 'close-icon',
        FormField: 'form-field',
        IconButton: 'icon-btn',
        InputLabel: 'input-label',
        InputNumber: 'input-number',
        InputSelect: 'input-select',
        InputText: 'input-text',
        MacroFormBlock: 'macro-form-block',
        MacroFormBlockButtons: 'macro-form-block-btns',
        MacroFormBlockFields: 'macro-form-block-fields',
        MacroFormBlocks: 'macro-form-blocks',
        MacroForm: 'macro-form'
    });


    const Options = {
        CW: {
            label: 'CW',
            value: 3
        },
        CCW: {
            label: 'CCW',
            value: 4
        },
        Disabled: {
            label: 'Disabled',
            value: 5
        },
        Linear: {
            label: 'Linear',
            value: 1
        },
        Rapid: {
            label: 'Rapid',
            value: 0
        },
        Absolute: {
            label: 'Absolute',
            value: 90
        },
        Incremental: {
            label: 'Incremental',
            value: 91
        },
        Inches: {
            label: 'Inches',
            value: 20
        },
        Millimeters: {
            label: 'Millimeters',
            value: 21
        },
        Away: {
            label: 'Away',
            value: 38.4
        },
        AwayNoError: {
            label: 'Away No Error',
            value: 38.4
        },
        Toward: {
            label: 'Toward',
            value: 38.2
        },
        TowardNoError: {
            label: 'Toward No Error',
            value: 38.3
        },
        Zero: {
            label: '0',
            value: 0
        },
        One: {
            label: '1',
            value: 1
        },
        Two: {
            label: '2',
            value: 2
        },
        Three: {
            label: '3',
            value: 3
        },
        Four: {
            label: '4',
            value: 4
        },
        Five: {
            label: '5',
            value: 5
        },
        Six: {
            label: '6',
            value: 6
        },
        Seven: {
            label: '7',
            value: 7
        },
        Eight: {
            label: '8',
            value: 8
        },
        Nine: {
            label: '9',
            value: 9
        }
    };

    const k = {
        ButtonNames: ButtonNames,
        Commands: Commands,
        TagNames: TagNames,
        EventNames: EventNames,
        FieldNames: FieldNames,
        Options: Options
    };

    const blockAfterEvent = new CustomEvent(EventNames$1.BlockAfter, { composed: true });
    const blockBeforeEvent = new CustomEvent(EventNames$1.BlockBefore, { composed: true });
    const blockRemoveEvent = new CustomEvent(EventNames$1.BlockRemove, { composed: true });

    const buildButton = (name, entity, clickEvent, addPadding) => {
        return {
            name: name,
            entity: entity,
            paddingBottom: addPadding ? '6px' : '0',
            handleClick: (event) => {
                event.target.dispatchEvent(clickEvent);
            }
        };
    };

    const button = (name) => {
        switch (name) {
            case ButtonNames$1.BlockAfter:
                return buildButton(name, '&darr;', blockAfterEvent, true);
            case ButtonNames$1.BlockBefore:
                return buildButton(name, '&uarr;', blockBeforeEvent, true);
            case ButtonNames$1.BlockRemove:
                return buildButton(name, '&times;', blockRemoveEvent);
            default:
                return null;
        }
    };

    const buttons = {
        [ButtonNames$1.BlockAfter]: buildButton(ButtonNames$1.BlockAfter, '&darr;', blockAfterEvent, true),
        [ButtonNames$1.BlockBefore]: buildButton(ButtonNames$1.BlockBefore, '&uarr;', blockBeforeEvent, true),
        [ButtonNames$1.BlockRemove]: buildButton(ButtonNames$1.BlockRemove, '&times;', blockRemoveEvent)
    };

    const buildSelectField = (name, options, label, value, selectEvent) => {
        return {
            name: name,
            inputTagName: TagNames$1.InputSelect,
            options: options,
            label: label === undefined ? '' : label,
            value: value === undefined ? '' : value,
            handleChange: (event) => {
                event.target.dispatchEvent(selectEvent(event));
            }
        };
    };

    const field = (name) => {
        switch (name) {
            case FieldNames$1.Command:
                return buildSelectField(name, TagNames$1.Inn)
        }
    };

    const fields = {
        [FieldNames$1.Command]: {
            value: '',
            inputTagName: TagNames$1.InputSelect,
            label: '',
            name: FieldNames$1.Command,
            options: [
                { label: '--Select Command--', value: '' },
                { label: 'Hold Execution', value: CommandNames.HoldExecution },
                { label: 'Move', value: CommandNames.Move },
                { label: 'Move Machine Coords', value: CommandNames.MoveInMachineCoords },
                { label: 'Pause', value: CommandNames.Pause },
                { label: 'Probe', value: CommandNames.Probe },
                { label: 'Set Coord System', value: CommandNames.SetCoordSystem },
                { label: 'Set Distance', value: CommandNames.SetDistance },
                { label: 'Set Spindle', value: CommandNames.SetSpindle },
                { label: 'Set Units', value: CommandNames.SetUnits },
            ],
            handleChange: (event) => {
                event.target.dispatchEvent(new CustomEvent(EventNames$1.CommandChanged, {
                    composed: true,
                    detail: {
                        value: event.target.value
                    }
                }));
            }
        },
        [FieldNames$1.MacroTitle]: {
            value: '',
            inputTagName: TagNames$1.InputText,
            label: 'Macro Title:',
            name: FieldNames$1.MacroTitle,
        },
        [FieldNames$1.CoordSystem]: {
            value: k.Options.Zero.value,
            inputTagName: TagNames$1.InputSelect,
            label: 'Coordinate System:',
            name: FieldNames$1.CoordSystem,
            options: [ 
                k.Options.Zero, 
                k.Options.One, 
                k.Options.Two, 
                k.Options.Three, 
                k.Options.Four, 
                k.Options.Five, 
                k.Options.Six, 
                k.Options.Seven, 
                k.Options.Eight, 
                k.Options.Nine 
            ]
        },
        [FieldNames$1.DistanceMode]: {
            value: k.Options.Incremental.value,
            inputTagName: TagNames$1.InputSelect,
            label: '',
            name: FieldNames$1.DistanceMode,
            options: [ k.Options.Absolute, k.Options.Incremental ]
        },
        [FieldNames$1.FeedRate]: {
            value: '',
            inputTagName: TagNames$1.InputNumber,
            label: 'Feed Rate:',
            name: FieldNames$1.FeedRate,
        },
        [FieldNames$1.MoveMode]: {
            value: k.Options.Linear.value,
            inputTagName: TagNames$1.InputSelect,
            label: '',
            name: FieldNames$1.MoveMode,
            options: [ k.Options.Linear, k.Options.Rapid ],
            handleChange: (event) => {
                event.target.dispatchEvent(new CustomEvent('movemodechanged', {
                    composed: true,
                    detail: {
                        value: event.target.value
                    }
                }));
            }
        },
        [FieldNames$1.ProbeMode]: {
            value: k.Options.Toward.value,
            inputTagName: TagNames$1.InputSelect,
            label: '',
            name: FieldNames$1.ProbeMode,
            options: [ k.Options.Toward, k.Options.Away, k.Options.TowardNoError, k.Options.AwayNoError ],
            
        },
        [FieldNames$1.SpindleMode]: {
            value: k.Options.Disabled.value,
            inputTagName: TagNames$1.InputSelect,
            label: '',
            name: FieldNames$1.SpindleMode,
            options: [ k.Options.CW, k.Options.CCW, k.Options.Disabled ],
            handleChange: (event) => {
                event.target.dispatchEvent(new CustomEvent('spindlemodechanged', {
                    composed: true,
                    detail: {
                        value: event.target.value
                    }
                }));
            }
        },
        [FieldNames$1.SpindleSpeed]: {
            value: '',
            inputTagName: TagNames$1.InputNumber,
            label: 'Speed:',
            name: FieldNames$1.SpindleSpeed
        },
        [FieldNames$1.Time]: {
            value: '',
            inputTagName: TagNames$1.InputNumber,
            label: 'Time:',
            name: FieldNames$1.Time,
        },
        [FieldNames$1.UnitsMode]: {
            value: k.Options.Inches.value,
            inputTagName: TagNames$1.InputSelect,
            label: '',
            name: FieldNames$1.UnitsMode,
            options: [ k.Options.Inches, k.Options.Millimeters ]
        },
        [FieldNames$1.X]: {
            value: '',
            inputTagName: TagNames$1.InputNumber,
            label: 'X:',
            name: FieldNames$1.X,
        },
        [FieldNames$1.Y]: {
            value: '',
            inputTagName: TagNames$1.InputNumber,
            label: 'Y:',
            name: FieldNames$1.Y,
        },
        [FieldNames$1.Z]: {
            value: '',
            inputTagName: TagNames$1.InputNumber,
            label: 'Z:',
            name: FieldNames$1.Z,
        }
    };



    const defaultBlockModel = {
        fieldModels: [
            {
                name: FieldNames$1.Command,
                value: ''
            }
        ]
    };

    const defaultMacroModel = {
        name: '',
        blockModels: [ defaultBlockModel ]
    };

    Object.freeze({
        button,
        field
    });

    class MacroFormComponentFactory {
        static block(blockModel) {
            return createComponent(TagNames$1.MacroFormBlock, { blockModel: blockModel || defaultBlockModel });
        }

        static blocks(blockModels) {
            return createComponent(TagNames$1.MacroFormBlocks, { blockModels: blockModels });
        }

        static button(name) {
            return createComponent(TagNames$1.IconButton, buttons[name]);
        }

        static form(macroModel) {
            if (!macroModel) {
                macroModel = defaultMacroModel;
            }
            return createComponent(TagNames$1.MacroForm, { macroModel: macroModel });
        }

        static field(name, value) {
            let props = fields[name];
            if (value != undefined) {
                props.value = value;
            }
            return createComponent(TagNames$1.FormField, props);
        }

        static commandArgs(command) {
            let fields;
            switch (command) {
                case CommandNames.Move:
                case CommandNames.MoveInMachineCoords:
                    fields = [ this.field(FieldNames$1.MoveMode), ...this._coordFields(), this.field(FieldNames$1.FeedRate) ];
                    break;
                case CommandNames.Pause:
                    fields = [ this.field(FieldNames$1.Time) ];
                    break;
                case CommandNames.Probe:
                    fields = [
                        this.field(FieldNames$1.ProbeMode),
                        
                        this.field(FieldNames$1.X),
                        this.field(FieldNames$1.Y),
                        this.field(FieldNames$1.Z),
                        this.field(FieldNames$1.FeedRate),
                    ];
                    break;
                case CommandNames.SetCoordSystem:
                    fields = [ this.field(FieldNames$1.CoordSystem) ];
                    break;
                case CommandNames.SetDistance:
                    fields = [ this.field(FieldNames$1.DistanceMode) ];
                    break;
                case CommandNames.SetSpindle:
                    fields = [ this.field(FieldNames$1.SpindleMode) ];
                    break;
                case CommandNames.SetUnits:
                    fields = [ this.field(FieldNames$1.UnitsMode) ];
                    break;
                default:
                    fields = [];
            }
            return fields;
        }

        static blockButtons() {
            return createComponent(TagNames$1.MacroFormBlockButtons);
        }

        static blockFields(fieldModels) {
            return createComponent(TagNames$1.MacroFormBlockFields, { fieldModels: fieldModels });
        }

        static label(text) {
            return createComponent(TagNames$1.InputLabel, { text: text });
        }

        static _coordFields() {
            return [
                this.field(FieldNames$1.X),
                this.field(FieldNames$1.Y),
                this.field(FieldNames$1.Z)
            ]
        }
    }

    class MacroFormComponentBase extends ComponentBase {
        _factory;
        
        constructor() {
            super();
            this._factory = MacroFormComponentFactory;
        }
    }

    class MacroForm extends MacroFormComponentBase {
        _name;
        _blocks;
        
        content() {
            let form = document.createElement('form');
            this._name = this._factory.field(FieldNames$1.MacroTitle, this._props.macroModel.name);
            this._blocks = this._factory.blocks(this._props.macroModel.blockModels);
            form.append(this._name, this._blocks);
            return form;
        }

        styleText() {
            return `form {
            display: flex;
            flex-flow: column nowrap;
            gap: 12px;
        } form > form-field {
            align-self: center;
        }`;
        }

        toModel() {
            this._props.model = {
                name: this._name.toModel().value,
                blocks: this._blocks.toModels()
            };
            return this._props.model;
        }
    }

    class MacroFormBlock extends MacroFormComponentBase {
        _fields;
        _buttons;

        content() {
            let wrapper = document.createElement('div');
            wrapper.className = 'block-wrapper';
            this._fields = this._factory.blockFields(this._props.blockModel.fieldModels);
            this._buttons = this._factory.blockButtons();
            wrapper.append(this._fields, this._buttons);

            return wrapper;
        }

        styleText() {
            return `.block-wrapper {
            border: solid 1px rgba(0,0,0,0.1);
            border-radius: 5px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            padding: 3px;
            gap: 10px;
        }`;
        }

        onRender() {
            this.addEventListener(EventNames$1.BlockAfter, this.handleBlockAfter);
            this.addEventListener(EventNames$1.BlockBefore, this.handleBlockBefore);
            this.addEventListener(EventNames$1.BlockRemove, this.handleBlockRemove);
        }

        handleBlockAfter() {
            this.after(this._factory.block());
        }

        handleBlockBefore() {
            this.before(this._factory.block());
        }

        handleBlockRemove() {
            this.remove();
        }

        toModel() {
            this._props.blockModel = {
                fields: this._fields?.toModels()
            };
            return this._props.blockModel;
        }
    }

    class MacroFormBlocks extends MacroFormComponentBase {
        _wrapper;

        content() {
            this._wrapper = document.createElement('div');
            this._wrapper.className = 'blocks-wrapper';
            this._props.blockModels.forEach(model => {
                this._wrapper.append(this._factory.block(model));
            });
            return this._wrapper;
        }

        styleText() {
            return `.blocks-wrapper {
            display: flex;
            flex-flow: column nowrap;
        }`;
        }

        toModels() {
            let blocks = this._wrapper.getElementsByTagName(TagNames$1.MacroFormBlock);
            let models = [];
            for (let i = 0; i < blocks.length; i++) {
                models.push(blocks.item(i).toModel());
            }
            this._props.blockModels = models;
            return this._props.blockModels;
        }
    }

    class MacroFormBlockFields extends MacroFormComponentBase {
        _fields;
        _wrapper;

        content() {
            this._wrapper = document.createElement('div');
            this._wrapper.className = 'fields-wrapper';
            this._props.fieldModels.forEach(model => {
                this._wrapper.append(this._factory.field(model.name, model.value));
                
            });

            this._fields = this._wrapper.getElementsByTagName('form-field');

            return this._wrapper;
        }

        styleText() {
            return `.fields-wrapper {
            display: flex;
            flex-flow: rowwrap;
            gap: 10px;
        }`;
        }
        _addField(name) {
            if (!this._fields.namedItem(name)) {
                this._wrapper.append(this._factory.field(name));
            }
        }

        _removeField(name) {
            let field = this._fields.namedItem(name);
            if (field) {
                field.remove();
            }
        }

        _handleCommandChanged(event) {
            while (this._fields.length > 1) {
                this._fields.item(this._fields.length - 1).remove();
            }
            let newFields = this._factory.commandArgs(event.detail.value);
            newFields.forEach(field => {
                this._wrapper.append(field);
            });
        }

        _handleMoveModeChanged(event) {
            if (event.detail.value == k.Options.Linear.value) {
                this._addField(FieldNames$1.FeedRate);
            }
            else {
                this._removeField(FieldNames$1.FeedRate);
            } 
        }

        _handleSpindleModeChanged(event) {
            if (event.detail.value == k.Options.CW.value || event.detail.value == k.Options.CCW.value) {
                this._addField(FieldNames$1.SpindleSpeed);
            }
            else {
                this._removeField(FieldNames$1.SpindleSpeed);
            } 
        }

        onRender() {
            this.addEventListener(EventNames$1.MoveModeChanged, this._handleMoveModeChanged);
            this.addEventListener(EventNames$1.SpindleModeChanged, this._handleSpindleModeChanged);
            this.addEventListener(EventNames$1.CommandChanged, this._handleCommandChanged);
        }

        toModels() {
            let models = [];
            for (let i = 0; i < this._fields.length; i++) {
                models.push(this._fields.item(i).toModel());
            }
            return models;
        }

    }

    class MacroFormBlockButtons extends MacroFormComponentBase {
        content() {
            let wrapper = document.createElement('div');
            wrapper.className = 'block-btns-wrapper';
            wrapper.append(
                this._factory.button(ButtonNames$1.BlockRemove),
                this._factory.button(ButtonNames$1.BlockAfter),
                this._factory.button(ButtonNames$1.BlockBefore)
            );
            return wrapper;
        }

        styleText() {
            return `.block-btns-wrapper {
            display: flex;
            flex-flow: row-reverse nowrap;
            align-items: center;
            gap: 6px;
        }`;
        }
    }

    class IconButton extends ComponentBase {
        content() {
            let element = document.createElement('span');
            element.innerHTML = this._props.entity || '';
            if (this._props.handleClick) {
                element.addEventListener('click', this._props.handleClick);
            }
            return element;
        }

        styleText() {
            return ` span {
            border-radius: 5px;
            background-color: #fff;
            color: #337AB7;
            float: right;
            font-size: 24px;
            font-weight: bolder;
            padding-bottom: ${this._props.paddingBottom};
            text-align: center;
            width: 20px;
        } span:hover, span:focus {
            background-color: #337AB7;
            color: #fff;
            text-decoration: none;
            cursor: pointer;
        }`
        }
    }

    const defineComponents = () => {
        customElements.define(TagNames$1.IconButton, IconButton);
        customElements.define(TagNames$1.InputLabel, InputLabel);
        customElements.define(TagNames$1.InputSelect, InputSelect);
        customElements.define(TagNames$1.InputNumber, InputNumber);
        customElements.define(TagNames$1.InputText, InputText);
        customElements.define(TagNames$1.FormField, FormField);
        customElements.define(TagNames$1.MacroFormBlock, MacroFormBlock);
        customElements.define(TagNames$1.MacroFormBlocks, MacroFormBlocks);
        customElements.define(TagNames$1.MacroFormBlockButtons, MacroFormBlockButtons);
        customElements.define(TagNames$1.MacroFormBlockFields, MacroFormBlockFields);
        customElements.define(TagNames$1.MacroForm, MacroForm);
    };

    exports.MacroFormComponentFactory = MacroFormComponentFactory;
    exports.defineComponents = defineComponents;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
