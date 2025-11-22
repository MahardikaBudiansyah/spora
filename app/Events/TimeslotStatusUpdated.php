<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TimeslotStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $fieldId;
    public $timeslotIds;
    public $date;
    public $statusId;
    public $venueId;

    public function __construct($fieldId, $timeslotIds, $date, $statusId, $venueId = null)
    {
        $this->fieldId = $fieldId;
        $this->timeslotIds = $timeslotIds;
        $this->date = $date;
        $this->statusId = $statusId;
        $this->venueId = $venueId;
    }

    public function broadcastOn()
    {
        return $this->venueId
            ? new PrivateChannel('venue.' . $this->venueId)
            : new PrivateChannel('field.' . $this->fieldId);
    }

    public function broadcastWith()
    {
        return [
            'field_id' => $this->fieldId,
            'timeslot_ids' => $this->timeslotIds,
            'date' => $this->date,
            'status_id' => $this->statusId,
        ];
    }

    public function broadcastAs()
    {
        return 'TimeslotStatusUpdated';
    }
}
