import React, {useEffect, useState} from "react";
import {LoginForm} from "../Forms/LoginForm/LoginForm";
import {RegisterForm} from '../Forms/RegistrationForm/RegisterForm'
import {RegistrationSuccessPopup, FormSwitcher} from "../Forms/commonStylesForm/common.styles";

export const ToggleFormTemplate = () => {
    const [toggleForm, setFormToggle] = useState(true)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)

    const handleToggleForm = () => {
        toggleForm ? (setFormToggle(false)) : (setFormToggle(true))
    }

    useEffect(() => {
        if (!registrationSuccess) return undefined

        const timeoutId = window.setTimeout(() => {
            setRegistrationSuccess(false)
            setFormToggle(true)
        }, 3500)

        return () => window.clearTimeout(timeoutId)
    }, [registrationSuccess])

    return (
        <FormSwitcher>
            {toggleForm
                ? <LoginForm handleLinkToRegister={handleToggleForm}/>
                : <RegisterForm
                    handleLinkToLogin={handleToggleForm}
                    onRegisterSuccess={() => setRegistrationSuccess(true)}
                />}
            {registrationSuccess && (
                <RegistrationSuccessPopup role="status" aria-live="polite">
                    Регистрация успешна! Переходим к форме входа…
                </RegistrationSuccessPopup>
            )}
        </FormSwitcher>
    )
}