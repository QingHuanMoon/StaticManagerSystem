<?php

namespace App\Listeners;

use App\Events\UserRegisterSuccess;
use App\Mail\UserActiveAccountEmail;
use App\Mailer\UserMailer;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendRegisterActiveEmail
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     *
     * @param  UserRegisterSuccess  $event
     * @return void
     */
    public function handle(UserRegisterSuccess $event)
    {
        Mail::to($event->user)->send(new UserActiveAccountEmail($event->user));
    }
}
