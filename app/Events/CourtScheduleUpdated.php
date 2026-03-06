<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CourtScheduleUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $courtId;
    public $timeslotIds;
    public $date;
    public $statusId;
    public $venueId;

    public function __construct($courtId, $timeslotIds, $date, $statusId, $venueId)
    {
        $this->courtId = $courtId;
        $this->timeslotIds = $timeslotIds;
        $this->date = $date;
        $this->statusId = $statusId;
        $this->venueId = $venueId;
    }

    // Ganti PrivateChannel → Channel publik
    public function broadcastOn()
    {
        return new Channel('venue.' . $this->venueId);
    }

    public function broadcastWith()
    {
        return [
            'field_id' => $this->courtId,
            'timeslot_ids' => $this->timeslotIds,
            'date' => $this->date,
            'status_id' => $this->statusId,
        ];
    }

    public function broadcastAs()
    {
        return 'CourtScheduleUpdated';
    }
}
