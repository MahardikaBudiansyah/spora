<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TimeslotStatusUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $fieldId;
    public $timeslotIds;
    public $date;
    public $statusId;
    public $venueId;
    /**
     * Create a new event instance.
     */
    public function __construct($fieldId, $timeslotIds, $date, $statusId, $venueId = null)
    {
        $this->fieldId = $fieldId;
        $this->timeslotIds = $timeslotIds;
        $this->date = $date;
        $this->statusId = $statusId;
        $this->venueId = $venueId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    
    public function broadcastOn()
    {
        if ($this->venueId) {
            return new PrivateChannel('venue.' . $this->venueId);
        }

        return new PrivateChannel('field.' . $this->fieldId);
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

}
