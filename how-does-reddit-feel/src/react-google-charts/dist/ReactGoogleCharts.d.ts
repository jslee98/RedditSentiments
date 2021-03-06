import * as React from "react";
import { GoogleViz, GoogleChartWrapperChartType, ChartWrapperOptions, GoogleChartWrapper, GoogleVizEventName, GoogleChartAction, GoogleDataTableRow, GoogleDataTableColumn, GoogleChartVersion, GoogleChartPackages, GoogleDataTableCell } from "./types";
export declare type ReactGoogleChartEvent = {
    eventName: GoogleVizEventName;
    callback: (eventCallbackArgs: {
        chartWrapper: GoogleChartWrapper;
        props: ReactGoogleChartPropsWithDefaults;
        google: GoogleViz;
        state: ReactGoogleChartState;
        eventArgs: any;
    }) => void;
};
export declare type ReactGoogleChartProps = {
    height?: string | number;
    width?: string | number;
    graphID?: string;
    chartType: GoogleChartWrapperChartType;
    diffdata?: {
        old: any;
        new: any;
    };
    options?: ChartWrapperOptions["options"];
    loader?: JSX.Element;
    data?: any[] | {};
    rows?: GoogleDataTableRow[];
    columns?: GoogleDataTableColumn[];
    chartActions?: GoogleChartAction[];
    chartEvents?: ReactGoogleChartEvent[];
    chartVersion?: GoogleChartVersion;
    chartPackages?: GoogleChartPackages[];
    chartLanguage?: string;
    mapsApiKey?: string;
    graph_id?: string;
    legendToggle?: boolean;
    legend_toggle?: boolean;
    getChartWrapper?: (chartWrapper: GoogleChartWrapper, google: GoogleViz) => void;
    className?: string;
    style?: React.CSSProperties;
    formatters?: {
        column: number;
        type: "ArrowFormat" | "BarFormat" | "ColorFormat" | "DateFormat" | "NumberFormat" | "PatternFormat";
        options?: {};
    }[];
};
export declare type ReactGoogleChartState = {
    loadingStatus: "loading" | "errored" | "ready";
    google: null | GoogleViz;
    hiddenColumns: string[];
};
export declare const chartDefaultProps: {
    graph_id: string | null;
    legend_toggle: boolean;
    graphID: null;
    options: Partial<{
        [otherOptionKey: string]: any;
        width: number;
        height: number;
        is3D: boolean;
        title: string;
        backgroundColor: string;
        hAxis?: {
            [otherOptionKey: string]: any;
            minValue?: number | undefined;
            maxValue?: number | undefined;
            ticks?: number[] | undefined;
            title?: string | undefined;
            viewWindow?: {
                max?: number | undefined;
                min?: number | undefined;
            } | undefined;
        } | undefined;
        vAxis?: {
            [otherOptionKey: string]: any;
            minValue?: number | undefined;
            maxValue?: number | undefined;
            ticks?: number[] | undefined;
            title?: string | undefined;
            viewWindow?: {
                max?: number | undefined;
                min?: number | undefined;
            } | undefined;
        } | undefined;
        legend: any;
        colors: string[];
    }>;
    data: null;
    rows: GoogleDataTableCell[][] | null;
    columns: GoogleDataTableColumn[] | null;
    diffdata: {
        old: any;
        new: any;
    } | null;
    chartEvents: ReactGoogleChartEvent[] | null;
    legendToggle: boolean;
    chartActions: GoogleChartAction[] | null;
    getChartWrapper: (chartWrapper: GoogleChartWrapper, google: GoogleViz) => void;
    className: string;
    style: {};
    formatters: null;
};
export declare type ReactGoogleChartPropsWithDefaults = typeof chartDefaultProps & ReactGoogleChartProps;
export declare class Chart extends React.Component<ReactGoogleChartProps, ReactGoogleChartState> {
    state: ReactGoogleChartState;
    graphID: null | string;
    chartWrapper: GoogleChartWrapper | null;
    static defaultProps: {
        graph_id: string | null;
        legend_toggle: boolean;
        graphID: null;
        options: Partial<{
            [otherOptionKey: string]: any;
            width: number;
            height: number;
            is3D: boolean;
            title: string;
            backgroundColor: string;
            hAxis?: {
                [otherOptionKey: string]: any;
                minValue?: number | undefined;
                maxValue?: number | undefined;
                ticks?: number[] | undefined;
                title?: string | undefined;
                viewWindow?: {
                    max?: number | undefined;
                    min?: number | undefined;
                } | undefined;
            } | undefined;
            vAxis?: {
                [otherOptionKey: string]: any;
                minValue?: number | undefined;
                maxValue?: number | undefined;
                ticks?: number[] | undefined;
                title?: string | undefined;
                viewWindow?: {
                    max?: number | undefined;
                    min?: number | undefined;
                } | undefined;
            } | undefined;
            legend: any;
            colors: string[];
        }>;
        data: null;
        rows: GoogleDataTableCell[][] | null;
        columns: GoogleDataTableColumn[] | null;
        diffdata: {
            old: any;
            new: any;
        } | null;
        chartEvents: ReactGoogleChartEvent[] | null;
        legendToggle: boolean;
        chartActions: GoogleChartAction[] | null;
        getChartWrapper: (chartWrapper: GoogleChartWrapper, google: GoogleViz) => void;
        className: string;
        style: {};
        formatters: null;
    };
    private getGraphID;
    private draw;
    private applyFormatters;
    private grayOutHiddenColumns;
    onResize: () => void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ReactGoogleChartPropsWithDefaults, prevState: ReactGoogleChartState): void;
    componentWillUnmount(): void;
    private setChartActions;
    private getColumnID;
    private listenToChartEvents;
    private listenToLegendToggle;
    private handleGoogleChartsLoaderScriptLoaded;
    private handleGoogleChartsLoaderScriptErrored;
    render(): JSX.Element;
}
export default Chart;
