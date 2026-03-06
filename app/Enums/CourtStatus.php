<?php

namespace App\Enums;

enum CourtStatus: string
{
    case AVAILABLE = 'Available';
    case MAINTENANCE = 'Maintenance';
    case EVENT     = 'Event';
    case BOOKED    = 'Booked';
}