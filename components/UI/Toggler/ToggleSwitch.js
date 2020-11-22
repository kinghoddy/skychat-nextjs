import React from "react";
import PropTypes from "prop-types";
import styles from "./switch.module.scss";

/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function. The props name, small, disabled
and optionLabels are optional.
Usage: <ToggleSwitch id="id" checked={value} onChange={checked => setValue(checked)}} />
*/

const ToggleSwitch = ({
    id,
    name,
    checked,
    onChange,
    optionLabels,
    small,
    width,
    disabled
}) => {
    function handleKeyPress(e) {
        if (e.keyCode !== 32) return;

        e.preventDefault();
        onChange(!checked);
    }

    return (
        <div className={styles.toggle_switch + (small ? " " + styles.small_switch : "")} style={{ width }}>
            <input
                type="checkbox"
                name={name}
                className={styles.toggle_switch_checkbox}
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            {id ? (
                <label
                    className={styles.toggle_switch_label}
                    tabIndex={disabled ? -1 : 1}
                    onKeyDown={(e) => handleKeyPress(e)}
                    htmlFor={id}
                >
                    <span
                        className={
                            disabled
                                ? styles.toggle_switch_inner + " " + styles.toggle_switch_disabled
                                : styles.toggle_switch_inner
                        }
                        data-yes={optionLabels[0]}
                        data-no={optionLabels[1]}
                        tabIndex={-1}
                    />
                    <span
                        className={
                            disabled
                                ? styles.toggle_switch_switch + " " + styles.toggle_switch_disabled
                                : styles.toggle_switch_switch
                        }
                        tabIndex={-1}
                    />
                </label>
            ) : null}
        </div>
    );
};

// Set optionLabels for rendering.
ToggleSwitch.defaultProps = {
    optionLabels: ["Yes", "No"]
};

ToggleSwitch.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
    optionLabels: PropTypes.array,
    small: PropTypes.bool,
    width: PropTypes.number,
    disabled: PropTypes.bool
};

export default ToggleSwitch;
