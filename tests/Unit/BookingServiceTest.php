<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\VenuePaymentType;
use App\Services\Booking\BookingService;

class BookingServiceTest extends TestCase
{
    public function test_calculate_dp_fixed_value()
    {
        $service = new BookingService();

        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'fixed',
            'dp_value' => 50000,
        ]);

        $result = $service->calculateDp($paymentType, 200000);

        $this->assertEquals(50000, $result);
    }

    public function test_calculate_dp_percentage_value()
    {
        $service = new BookingService();

        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'percentage',
            'dp_value' => 25,
        ]);

        $result = $service->calculateDp($paymentType, 200000);

        $this->assertEquals(50000, $result);
    }

    public function test_calculate_dp_disabled()
    {
        $service = new BookingService();

        $paymentType = new VenuePaymentType([
            'enable_dp' => false,
        ]);

        $result = $service->calculateDp($paymentType, 200000);

        $this->assertEquals(200000, $result);
    }
}
