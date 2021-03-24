<template>
    <v-row class="chart-card d-flex justify-space-between ma-0 mt-3 pt-3 pb-2 px-5 white">
        <fusioncharts
            class="h-full mx-6 mt-3"
            :data-source="dataSource"
            :dataformat="dataFormat"
            :height="height"
            :type="type"
            :width="width"
        />
    </v-row>
</template>

<script>
import Vue from 'vue';
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);
import { mapState } from 'vuex'

const categories = [{
    "category": [{
            "label": "Jan"
        },
        {
            "label": "Feb"
        },
        {
            "label": "Mar"
        },
        {
            "label": "Apr"
        },
        {
            "label": "May"
        },
        {
            "label": "Jun"
        },
        {
            "label": "Jul"
        },
        {
            "label": "Aug"
        },
        {
            "label": "Sep"
        },
        {
            "label": "Oct"
        },
        {
            "label": "Nov"
        },
        {
            "label": "Dec"
        }
    ]
}]
const dataset = [{
        "seriesName": "Actual Revenue",
        "showValues": "1",
        "data": [{
                "value": "16000"
            },
            {
                "value": "20000"
            },
            {
                "value": "18000"
            },
            {
                "value": "19000"
            },
            {
                "value": "15000"
            },
            {
                "value": "21000"
            },
            {
                "value": "16000"
            },
            {
                "value": "20000"
            },
            {
                "value": "17000"
            },
            {
                "value": "25000"
            },
            {
                "value": "19000"
            },
            {
                "value": "23000"
            }
        ]
    },
    {
        "seriesName": "Projected Revenue",
        "renderAs": "line",
        "data": [{
                "value": "15000"
            },
            {
                "value": "16000"
            },
            {
                "value": "17000"
            },
            {
                "value": "18000"
            },
            {
                "value": "19000"
            },
            {
                "value": "19000"
            },
            {
                "value": "19000"
            },
            {
                "value": "19000"
            },
            {
                "value": "20000"
            },
            {
                "value": "21000"
            },
            {
                "value": "22000"
            },
            {
                "value": "23000"
            }
        ]
    },
    {
        "seriesName": "Profit",
        "renderAs": "area",
        "data": [{
                "value": "4000"
            },
            {
                "value": "5000"
            },
            {
                "value": "3000"
            },
            {
                "value": "4000"
            },
            {
                "value": "1000"
            },
            {
                "value": "7000"
            },
            {
                "value": "1000"
            },
            {
                "value": "4000"
            },
            {
                "value": "1000"
            },
            {
                "value": "8000"
            },
            {
                "value": "2000"
            },
            {
                "value": "7000"
            }
        ]
    }
]

const dataSource = {
    "chart": {
        "caption": "Harry's SuperMart",
        "subCaption": "Sales analysis of last year",
        "xAxisname": "Month",
        "yAxisName": "Amount (In USD)",
        "numberPrefix": "$",
        "divlineColor": "#999999",
        "divLineIsDashed": "1",
        "divLineDashLen": "1",
        "divLineGapLen": "1",
        "toolTipColor": "#ffffff",
        "toolTipBorderThickness": "0",
        "toolTipBgColor": "#000000",
        "toolTipBgAlpha": "80",
        "toolTipBorderRadius": "2",
        "toolTipPadding": "5",
        "theme": "fusion"
    },
    categories: categories,
    dataset: dataset
};


export default {
  name: 'ChartCard',
  data: () => ({
    width: '95%',
    height: '100%',
    dataFormat: 'json',
    "baseFontColor": "#0066cc",
    type: "mscombi2d",
    dataSource
  }),
  computed: {
    ...mapState(['charts'])
  }
}
</script>

<style lang="scss" scoped>
.fusioncharts-container svg{
  background-color: transparent !important;
}
.fusioncharts-container .raphael-group-71-background rect, g rect{
  fill-opacity: 0;
}
[class$='-plot-group'] rect {
  fill-opacity: 1;
}
.chart-card {
  height: 400px;
  div {
    width: 100%;
    margin: 0 !important;
  }
}
</style>
