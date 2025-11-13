<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::table('orders', function (Blueprint $table) {
            $table->string('order_status')->default('pending')->after('total_amount');
            $table->string('payment_status')->default('pending')->after('order_status');
        });

        // Copying old status data if exists
        DB::table('orders')->update([
            'order_status' => DB::raw('status'),
            'payment_status' => 'pending',
        ]);

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
          Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('pending');
            $table->dropColumn(['order_status', 'payment_status']);
        });
    }
};
