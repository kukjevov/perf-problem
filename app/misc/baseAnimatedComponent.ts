import {AnimationEvent} from '@angular/animations';
import {HostListener, HostBinding} from '@angular/core';

import * as global from 'config/global';

/**
 * Base class that enables fly in out animation
 */
export class BaseAnimatedComponent
{
    //######################### protected fields #########################

    /**
     * Additional css classes that are applied to component
     */
    protected _additionalCssClasses: string = "";

    //######################### public properties - bindings #########################

    /**
     * Attach animation directly to component (enter, exit)
     */
    @HostBinding('@flyInOut')
    public animatedComponent = true;

    /**
     * Class that is assigned for animated component
     */
    @HostBinding('class.fly-in-out')
    public animatedComponentClass = true;

    /**
     * Called when animation has completed
     */
    @HostListener('@flyInOut.done', ['$event'])
    public animationDone(event: AnimationEvent)
    {
        this._animationDone(event);
    }

    /**
     * Application theme css
     */
    @HostBinding("class")
    public get theme(): string
    {
        return `app-page app-page-${global.theme} ${this._additionalCssClasses}`;
    }

    //######################### protected methods #########################

    /**
     * Called when animation has finished its duration
     * @param {AnimationEvent} event Event of finished animation
     */
    protected _animationDone(event: AnimationEvent)
    {
    }
}