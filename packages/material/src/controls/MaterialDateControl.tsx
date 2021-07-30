/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import startsWith from 'lodash/startsWith';
import merge from 'lodash/merge';
import React from 'react';
import {
  computeLabel,
  ControlState,
  DispatchPropsOfControl,
  isDateControl,
  isDescriptionHidden,
  isPlainLabel,
  RankedTester,
  rankWith,
  StatePropsOfControl
} from '@jsonforms/core';
import { Control, withJsonFormsControlProps } from '@jsonforms/react';
import { Hidden } from '@material-ui/core';
import moment from 'moment';
import { Moment } from 'moment';
import AdapterMoment from '@material-ui/lab/AdapterMoment';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import DatePicker from '@material-ui/lab/DatePicker';
import TextField from '@material-ui/core/TextField';
export interface DateControl {
  momentLocale?: Moment;
}

export class MaterialDateControl extends Control<
  StatePropsOfDateControl & DispatchPropsOfControl & DateControl,
  ControlState
> {
  render() {
    const {
      description,
      id,
      errors,
      label,
      uischema,
      visible,
      enabled,
      required,
      path,
      handleChange,
      data,
      momentLocale,
      config
    } = this.props;
    const defaultLabel = label as string;
    const cancelLabel = '%cancel';
    const clearLabel = '%clear';
    const isValid = errors.length === 0;
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const showDescription = !isDescriptionHidden(
      visible,
      description,
      this.state.isFocused,
      appliedUiSchemaOptions.showUnfocusedDescription
    );
    const inputProps = {};
    const localeDateTimeFormat = momentLocale
      ? `${momentLocale.localeData().longDateFormat('L')}`
      : 'YYYY-MM-DD';

    let labelText: string;
    let labelCancel: string;
    let labelClear: string;

    if (isPlainLabel(label)) {
      labelText = label;
      labelCancel = 'Cancel';
      labelClear = 'Clear';
    } else {
      labelText = defaultLabel;
      labelCancel = startsWith(cancelLabel, '%') ? 'Cancel' : cancelLabel;
      labelClear = startsWith(clearLabel, '%') ? 'Clear' : clearLabel;
    }

    return (
      <Hidden xsUp={!visible}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            renderInput ={ (params: any )=>
            <TextField {...params}
              id={id + '-input'}
              label={computeLabel(
                labelText,
                required,
                appliedUiSchemaOptions.hideRequiredAsterisk
              )}
              error={!isValid}
              fullWidth={!appliedUiSchemaOptions.trim}
              helperText={!isValid ? errors : showDescription ? description : ' '}
              InputLabelProps={{ shrink: true }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              InputProps={inputProps}
            />}           
            value={data || null}
            onChange={(datetime: any) =>
              handleChange(
                path,
                datetime ? moment(datetime).format('YYYY-MM-DD') : ''
              )
            }
            inputFormat={localeDateTimeFormat}
            clearable={true}
            clearText = { labelCancel }
            cancelText = { labelClear }
            disabled={!enabled}
            autoFocus={appliedUiSchemaOptions.focus}
          />
        </LocalizationProvider>
      </Hidden>
    );
  }
}

export interface StatePropsOfDateControl extends StatePropsOfControl {
  defaultLabel: string;
  cancelLabel: string;
  clearLabel: string;
}

export const materialDateControlTester: RankedTester = rankWith(
  4,
  isDateControl
);

export default withJsonFormsControlProps(MaterialDateControl);
