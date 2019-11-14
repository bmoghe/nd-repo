Object.defineProperty(exports, "__esModule", { value: true });
var ParamsGenerator2Class = (function () {
    function ParamsGenerator2Class() {
    }
    ParamsGenerator2Class.prototype.getParams = function (data) {
        if (data.hasOwnProperty('join') && data.join.length > 0) {
            return this.getMultiFactParams(data);
        }
        else {
            return this.getSingleFactParams(data);
        }
    };
    ParamsGenerator2Class.prototype.getMeasureSignature = function (measure) {
        var limit = measure.limit;
        var active = !measure.hidden;
        return [
            measure.id,
            measure.func,
            (limit ? (limit.direction + ':' + limit.limit + (limit.percentage ? ':%' : '')) : ''),
            measure.cumulativeFunc,
            (active ? '' : 1),
            measure.label || '',
            measure.percentageOfTotal ? 'PT' : ''
        ].join('|');
    };
    ParamsGenerator2Class.prototype.getAttributeSignature = function (attribute) {
        return attribute.id + '|' + (attribute.label || '');
    };
    ParamsGenerator2Class.prototype.getSignature = function (dataSource) {
        if (dataSource.type === "attribute") {
            return this.getAttributeSignature(dataSource);
        }
        else if (dataSource.type === "measure") {
            return this.getMeasureSignature(dataSource);
        }
    };
    /**
     * @param {Array} filters Array of Aera.data.DataSourceFilter.
     * @return {String}
     * @private
     */
    ParamsGenerator2Class.prototype.formatDimensionFilters = function (filters) {
        var buf1 = [], lang, buf2, i, j, filter, values, value, operator, filtersLength, valuesLength;
        // DV = Aera.report.data.dimension.Variable;
        for (i = 0, filtersLength = filters.length; i < filtersLength; i++) {
            filter = filters[i];
            lang = filter.language;
            operator = filter.operator;
            values = [].concat(filter.value);
            buf2 = [];
            for (j = 0, valuesLength = values.length; j < valuesLength; j++) {
                value = values[j];
                if (value.variable === true) {
                    if (value.type === 'USER') {
                        value = 'var_USERFILTER';
                    }
                    else {
                        value = 'var_' + value.id;
                    }
                }
                // else if (value instanceof Aera.model.FilterDimensionExpression){
                //     value = 'expr_' + value.get('value');
                // }
                buf2.push(value);
            }
            buf1.push(operator + '|' + buf2.join('|'));
        }
        return filters[0].dataSource.id + '~' + buf1.join('~') + '~' + lang;
    };
    ParamsGenerator2Class.prototype.formatMeasureFilters = function (filter) {
        var dataSource = filter.dataSource;
        var value = [].concat(filter.value);
        return dataSource.id + '|' + (filter.level === 'transaction' ? 'TRA' : dataSource.func) +
            '~' + filter.operator + '|' + (value[0] != null ? value[0] : '') +
            '|' + (value[1] != null ? value[1] : '');
    };
    ParamsGenerator2Class.prototype.getSingleFactParams = function (data) {
        var params = {
            sheetid: data.viewId,
            bioid: data.reportId,
            fid: data.factId,
            row: null,
            col: null,
            mea: null,
            filter: null
        },
        // hasHierarchy = data.hasOwnProperty('hasHierarchy') && data.hasHierarchy,
        // hasExtPivotGrid = view.hasOwnProperty('isPivotGrid') && view.isPivotGrid(),
        columns = data.columns, groups = data.groups, measures = data.measures, sortInfo = data.sort, filters = data.filters,
        // groupSummaries = data.groupSummaries || [],
        sortField = [], sortDirection = [],
        // ranking = [],
        // currency = [],
        dimension, i, temp, measure, limit, active, sort, len, tmp, isMeasure; //, j, found, trendline,
        // factId = data.factId,
        // unsupportedMultiFactSummarie = ['sum', 'avg'],
        // hierarchyAttrs = [],
        // hasGroups = groupSummaries.length > 0 || groups.length > 0;
        // build the columns
        temp = [];
        for (i = 0, len = columns.length; i < len; i++) {
            dimension = columns[i];
            temp.push(this.getAttributeSignature(dimension)); // we are not passing label intentionally
        }
        if (temp.length > 0) {
            params.row = temp.join(',');
        }
        // build the sorting
        if (sortInfo) {
            for (i = 0, len = sortInfo.length; i < len; i++) {
                sort = sortInfo[i];
                sortField.push((sort.groups ? sort.groups.join('|') + '~' : '') + this.getSignature(sort.dataSource));
                sortDirection.push(sort.direction);
            }
            params.sort = sortField.join(',');
            params.dir = sortDirection.join(',');
        }
        else {
            params.sort = null;
            params.dir = null;
        }
        // build the groups
        temp = [];
        for (i = 0, len = groups.length; i < len; i++) {
            dimension = groups[i];
            temp.push(dimension.id);
        }
        if (temp.length > 0) {
            params.col = temp.join(',');
        }
        // build the filters
        if (filters.length > 0) {
            var dimensionFilters = {
                locked: {},
                unlocked: {}
            }, id, locked, dataSource, value, filter;
            params.filter = [];
            for (i = 0, len = filters.length; i < len; i++) {
                filter = filters[i];
                dataSource = filter.dataSource;
                isMeasure = dataSource.type === 'measure';
                value = filter.value;
                if (isMeasure) {
                    value = [].concat(value);
                    // params.filter.push(this.getSignature(dataSource));
                    // params.value = value.join(',');
                    params.filter.push(this.formatMeasureFilters(filter));
                }
                else {
                    id = dataSource.id;
                    locked = filter.locked ? 'locked' : 'unlocked';
                    if (!dimensionFilters[locked].hasOwnProperty(id)) {
                        dimensionFilters[locked][id] = [];
                    }
                    dimensionFilters[locked][id].push(filter);
                }
            }
            for (locked in dimensionFilters) {
                for (id in dimensionFilters[locked]) {
                    if ((tmp = dimensionFilters[locked][id]).length > 0) {
                        var opMap = {}, c, o, op;
                        for (c = 0; c < tmp.length; c++) {
                          if (tmp[c].source === 'pivot') {
                            params.filter.push(this.formatDimensionFilters([tmp[c]]));
                          } else {
                            op = tmp[c].operator;
                            if (!opMap[op]) {
                              opMap[op] = [];
                            }
                            opMap[op].push(tmp[c]);
                          }
                        }
                        //For each operator, process the filters
                        for (o in opMap) {
                            params.filter.push(this.formatDimensionFilters(opMap[o]));
                        }
                    }
                }
            }
            params.filter = params.filter.join('^');
        }
        // build the summaries
        var summaries = data.summaries, rowSummaries = data.rowSummaries, columnSummaries = data.columnSummaries;
        if (summaries && (len = summaries.length) > 0 && (rowSummaries || columnSummaries)) {
            if (summaries.length > 0) {
                params.rptaggfn = summaries.join(',');
                if (rowSummaries) {
                    params.totrowp = 1;
                }
                if (columnSummaries) {
                    params.totcolp = 1;
                }
            }
        }
        // build the measures
        temp = [];
        for (i = 0, len = measures.length; i < len; i++) {
            measure = measures[i];
            limit = measure.limit;
            active = !measure.hidden;
            temp.push(this.getMeasureSignature(measure));
        }
        params.mea = temp.join(',');
        if (data.geo) {
            params.geo = data.geo;
        }
        return params;
    };
    ParamsGenerator2Class.prototype.getMultiFactParams = function (data) {
    };
    return ParamsGenerator2Class;
}());
exports.ParamsGenerator2 = new ParamsGenerator2Class();
//# sourceMappingURL=ParamsGenerator2.js.map
