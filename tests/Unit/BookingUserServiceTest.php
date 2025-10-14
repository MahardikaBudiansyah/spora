<?php

namespace Tests\Unit;

use Tests\TestCase;
use Mockery;
use App\Models\VenuePaymentType;
use App\Services\Booking\BookingUserService;
use App\Services\Billing\PaymentService;

class BookingUserServiceTest extends TestCase
{
    protected $paymentService;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock PaymentService
        $this->paymentService = Mockery::mock(PaymentService::class);

        // Inject hanya PaymentService, karena BookingUserService butuh satu argumen saja
        $this->service = new BookingUserService($this->paymentService);
    }

    /** @test */
    public function user_booking_with_full_payment_when_dp_disabled()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => false,
            'dp_type' => null,
            'dp_value' => 0,
        ]);

        $total = 200000;
        $result = $this->invokeMethod($this->service, 'calculateDp', [$paymentType, $total]);

        $this->assertEquals($total, $result);
    }

    /** @test */
    public function user_booking_with_fixed_dp()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'fixed',
            'dp_value' => 50000,
        ]);

        $total = 200000;
        $result = $this->invokeMethod($this->service, 'calculateDp', [$paymentType, $total]);

        $this->assertEquals(50000, $result);
    }

    /** @test */
    public function user_booking_with_percentage_dp()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'percentage',
            'dp_value' => 25,
        ]);

        $total = 200000;
        $result = $this->invokeMethod($this->service, 'calculateDp', [$paymentType, $total]);

        $this->assertEquals(50000, $result);
    }

    /** @test */
    public function user_booking_with_apply_to_merchant_should_ignore_dp()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'fixed',
            'dp_value' => 50000,
            'apply_to_merchant' => true,
        ]);

        $total = 200000;

        // Karena apply_to_merchant = true → user bayar full
        $result = $this->invokeMethod($this->service, 'calculateDp', [$paymentType, $total]);

        $this->assertEquals(200000, $result);
    }

    /**
     * Helper untuk akses method protected/private.
     */
    protected function invokeMethod(&$object, $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invokeArgs($object, $parameters);
    }
}
