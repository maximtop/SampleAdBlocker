import { createMachine, interpret } from 'xstate';

const STATES = {
    // content blocker before init
    IDLE: 'idle',

    // content blocker is initiating
    INITIATING: 'initiating',

    // initiated successfully
    INITIATED: 'initiated',

    // an error occurred on init
    REJECTED: 'rejected',
};

const EVENTS = {
    INIT: 'init',
    ERROR: 'error',
    SUCCESS: 'success',
};

/**
 * Finite state machine of the content blocker states
 */
const contentBlockerFSM = createMachine({
    id: 'contentBlocker',
    initial: STATES.IDLE,
    states: {
        [STATES.IDLE]: {
            on: { [EVENTS.INIT]: STATES.INITIATING },
        },
        [STATES.INITIATING]: {
            on: {
                [EVENTS.SUCCESS]: STATES.INITIATED,
                [EVENTS.ERROR]: STATES.REJECTED,
            },
        },
        [STATES.INITIATED]: {
            type: 'final',
        },
        [STATES.REJECTED]: {
            type: 'final',
        },
    },
});

const contentBlockerService = interpret(contentBlockerFSM)
    .start();

/**
 * Used to wait until content blocker is initiated
 */
const waitInit = () => {
    return new Promise<void>((resolve) => {
        const currentState = contentBlockerService.state;
        const finalStates = [STATES.IDLE, STATES.INITIATED, STATES.REJECTED];

        if (finalStates.some((s) => currentState.matches(s))) {
            resolve();
            return;
        }

        contentBlockerService.onTransition((state) => {
            if (finalStates.some((s) => state.matches(s))) {
                resolve();
            }
        });
    });
};

export const contentBlockerMachine = {
    waitInit,
    /**
     * Sends init event to the content blocker finite state machine
     */
    start: () => {
        contentBlockerService.send(EVENTS.INIT);
    },
    /**
     * Sends success event to the content blocker finite state machine
     */
    sendSuccess: () => contentBlockerService.send(EVENTS.SUCCESS),
    /**
     * Sends error event to the content blocker finite state machine
     */
    sendError: () => contentBlockerService.send(EVENTS.ERROR),
    /**
     * Checks if the content blocker is initiated
     */
    isInitiated: () => contentBlockerService.state.matches(STATES.INITIATED),
    /**
     * Checks if the content blocker is initiating
     */
    isInitiating: () => contentBlockerService.state.matches(STATES.INITIATING),
};
