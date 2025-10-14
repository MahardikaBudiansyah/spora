<?php

namespace Tests\Unit;

use Mockery;
use Tests\TestCase;
use App\Models\VenuePaymentType;
use App\Services\Billing\PaymentService;
use App\Services\Booking\BookingMerchantService;

class BookingMerchantServiceTest extends TestCase
{
    protected BookingMerchantService $service;

    protected function setUp(): void
{
    parent::setUp();

    // Sesuaikan namespace-nya dengan yang dipakai di BookingMerchantService
    $mockPaymentService = \Mockery::mock(\App\Services\Billing\PaymentService::class);

    $this->service = new \App\Services\Booking\BookingMerchantService($mockPaymentService);
}

    /** @test */
    public function merchant_booking_with_full_payment_when_dp_disabled()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => false,
            'apply_to_merchant' => true,
        ]);

        $totalPrice = 200000;
        $dpAmount = $this->service->calculateDp($paymentType, $totalPrice, true);

        $this->assertEquals($totalPrice, $dpAmount);
    }

    /** @test */
    public function merchant_booking_with_fixed_dp()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'fixed',
            'dp_value' => 50000,
            'apply_to_merchant' => true,
        ]);

        $totalPrice = 200000;
        $dpAmount = $this->service->calculateDp($paymentType, $totalPrice, true);

        $this->assertEquals(50000, $dpAmount);
    }

    /** @test */
    public function merchant_booking_with_percentage_dp()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'percentage',
            'dp_value' => 25,
            'apply_to_merchant' => true,
        ]);

        $totalPrice = 200000;
        $dpAmount = $this->service->calculateDp($paymentType, $totalPrice, true);

        $this->assertEquals(50000, $dpAmount); // 25% dari 200k
    }

    /** @test */
    public function merchant_booking_with_non_applicable_payment_type_should_full()
    {
        $paymentType = new VenuePaymentType([
            'enable_dp' => true,
            'dp_type' => 'percentage',
            'dp_value' => 50,
            'apply_to_merchant' => false, // tidak berlaku ke merchant
        ]);

        $totalPrice = 200000;
        $dpAmount = $this->service->calculateDp($paymentType, $totalPrice, true);

        $this->assertEquals($totalPrice, $dpAmount);
    }
}
