import { Trigger } from './Trigger';
import { Action } from './Action';

/**
 * Representation of the decoded json with blocker entries
 */
export interface BlockerEntry {
    trigger: Trigger
    action: Action
}
