package com.viseo.apph.dto;

import com.fasterxml.jackson.annotation.JsonValue;

public class FilterRequest {
    @JsonValue
    FilterDto[] filterList;
    @JsonValue
    SortDto[] sortModel;
    @JsonValue
    int pageSize;
    @JsonValue
    int page;

    public int getPageSize() {
        return pageSize;
    }

    public FilterRequest setPageSize(int pageSize) {
        this.pageSize = pageSize;
        return this;
    }

    public int getPage() {
        return page;
    }

    public FilterRequest setPage(int page) {
        this.page = page;
        return this;
    }

    public FilterDto[] getFilters() {
        return filterList;
    }

    public FilterRequest setFilterList(FilterDto[] filterList) {
        this.filterList = filterList;
        return this;
    }

    public SortDto[] getSortModel() {
        return sortModel;
    }

    public FilterRequest setSortModel(SortDto[] sortModel) {
        this.sortModel = sortModel;
        return this;
    }
}

