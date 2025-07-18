<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\PelanggaranController;
use Illuminate\Support\Facades\Route;

Route::apiResource('kelas', KelasController::class);
Route::apiResource('siswa', SiswaController::class);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify-token', [AuthController::class, 'verifyToken']);
    Route::apiResource('pelanggaran', PelanggaranController::class);
    Route::get('/bukti/{id}/view', [PelanggaranController::class, 'getBuktiFile']);
    Route::get('/bukti/{id}/download', [PelanggaranController::class, 'downloadBuktiFile']);
    Route::get('/bukti/image/{id}', [PelanggaranController::class, 'getBuktiImage']);
});

Route::get('/dashboard/stats', [DashboardController::class, 'index']);

