import React from 'react';

import {
    strengthIndicator,
    strengthColor,
    strengthWidth,
    strengthName,
    strengthVisibility} from '../../constants/strength-password';

function PasswordInput(props) {

    const strength = strengthIndicator(props.value);
    const color = strengthColor(strength);
    const width = strengthWidth(strength);
    const name = strengthName(strength)
    const hidden = strengthVisibility(strength);

    return (
        <div className="form-group input-group">
            <div className="input-group-prepend">
                <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
            </div>
            <input
                id={props.id}
                className='form-control'
                placeholder={props.placeholder}
                onChange={props.handleChanges}
                name='passwordOne'
                value={props.value}
                type='password'
                required
                style={{
                    borderColor: color,
                    borderWidth: width,
                }}
            />
            <div className="input-group-prepend" id="password-str" hidden={hidden}>
                <span
                    className="input-group-text"
                    style={{
                        color: color,
                        style: "bold",
                        background: "none",
                        border: "none"
                    }}>
                    {name} </span>
            </div>
        </div>

    )
}

export default PasswordInput