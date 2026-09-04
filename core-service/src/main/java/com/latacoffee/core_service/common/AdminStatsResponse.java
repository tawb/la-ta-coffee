package com.latacoffee.core_service.common;

import java.util.Map;

public record AdminStatsResponse(
        double totalRevenue,
        double averageOrderValue,
        Map<String, Long> ordersByStatus,
        double averagePartySize,
        Map<String, Long> reservationsByStatus
) {
}