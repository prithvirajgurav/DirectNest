package com.directnest.property.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ListingType {
    SALE,
    RENT;

    @JsonCreator
    public static ListingType fromString(String value) {
        if (value == null) return null;
        String val = value.trim().toUpperCase();
        if ("SELL".equals(val) || "SALE".equals(val) || "FOR_SALE".equals(val)) {
            return SALE;
        }
        if ("RENT".equals(val) || "LEASE".equals(val) || "FOR_RENT".equals(val)) {
            return RENT;
        }
        for (ListingType type : ListingType.values()) {
            if (type.name().equalsIgnoreCase(val)) return type;
        }
        return SALE;
    }
}
