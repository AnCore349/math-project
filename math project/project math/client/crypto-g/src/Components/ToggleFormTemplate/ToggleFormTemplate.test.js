import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import AuthStore from '../../store/authentication/auth.store';
import {ToggleFormTemplate} from './ToggleFormTemplate';

afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
});

it('shows registration success for 3.5 seconds, then opens the login form', async () => {
    jest.useFakeTimers();
    jest.spyOn(AuthStore, 'handleAddCredoRegister').mockResolvedValue(true);
    render(<ToggleFormTemplate/>);

    fireEvent.click(screen.getByRole('button', {name: 'Registration'}));
    fireEvent.change(screen.getByPlaceholderText('Enter your nickname'), {
        target: {value: 'CryptoUser'},
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: {value: 'user@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: {value: 'secret'},
    });
    await act(async () => {
        fireEvent.click(screen.getByRole('button', {name: 'Registration'}));
    });

    expect(screen.getByRole('status')).toHaveTextContent(
        'Регистрация успешна! Переходим к форме входа…',
    );
    expect(screen.getByPlaceholderText('Enter your nickname')).toBeInTheDocument();

    act(() => {
        jest.advanceTimersByTime(3500);
    });

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter your nickname')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
