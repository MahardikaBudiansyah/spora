<?php

namespace Tests\Feature;

use Tests\TestCase;
use Mockery;
use App\Models\User;
use App\Models\Venue;
use App\Models\Field;
use App\Services\Booking\BookingUserService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BookingControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_booking_successfully()
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create();
        $field = Field::factory()->create(['venue_id' => $venue->id]);

        // Mock BookingUserService agar tidak benar-benar memproses transaksi
        $mockService = Mockery::mock(BookingUserService::class);
        $mockService->shouldReceive('create')
            ->once()
            ->andReturn([
                (object)['slug' => 'booking-slug'],
                (object)['invoice_no' => 'INV-001'],
                (object)['id' => 123],
                'token-xyz'
            ]);

        $this->app->instance(BookingUserService::class, $mockService);

        $payload = [
            'customer' => ['name' => 'John Doe', 'phone' => '0812345678'],
            'details' => [
                ['field_id' => $field->id, 'cart_id' => 1, 'slot_time' => '09:00']
            ],
            'payment' => [
                'venue_payment_type_id' => 1,
                'method' => 'gateway'
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->postJson('/booking', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'booking_slug' => 'booking-slug',
                'invoice_no' => 'INV-001',
                'payment_id' => 123,
                'snap_token' => 'token-xyz',
            ]);
    }

    /** @test */
    public function it_handles_exception_during_booking_creation()
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create();
        $field = Field::factory()->create(['venue_id' => $venue->id]);

        $mockService = Mockery::mock(BookingUserService::class);
        $mockService->shouldReceive('create')
            ->once()
            ->andThrow(new \Exception('Simulated error'));

        $this->app->instance(BookingUserService::class, $mockService);

        $payload = [
            'customer' => ['name' => 'Jane Doe', 'phone' => '0812345678'],
            'details' => [
                ['field_id' => $field->id, 'cart_id' => 1, 'slot_time' => '10:00']
            ],
            'payment' => [
                'venue_payment_type_id' => 1,
                'method' => 'gateway'
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->postJson('/booking', $payload);

        $response->assertStatus(500)
            ->assertJson([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat booking.',
            ]);
    }
}
