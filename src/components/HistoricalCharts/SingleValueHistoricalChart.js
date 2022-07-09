import * as React from 'react';
import PropTypes from 'prop-types';
import {
    NewInfoCardContent,
    InfoCardTitle
  } from "../Info-elements/info-elements";
import CardLoading from '../CardLoading/CardLoading';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
    Chart as ChartJS,
    registerables
  } from "chart.js";

ChartJS.register(
...registerables
);

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: '270px',
    color: theme.palette.text.secondary,
  }));


export default function SingleValueHistoricalChart(props) {

    const { cardTittle, isDataAvailable, labelName, dataList, unit, timeBasis, chartColor } = props;

    return (
        <React.Fragment>  
            <Item>
                <InfoCardTitle>{cardTittle}</InfoCardTitle>
                {!isDataAvailable? <CardLoading/> : (
                <NewInfoCardContent marginTop="30px">
                    <Line
                        data={{
                            datasets: [{
                                label: labelName,
                                data: dataList,
                                parsing: {
                                    yAxisKey: 'value',
                                    xAxisKey: '_id'
                                },
                                backgroundColor: chartColor,
                                borderColor: chartColor
                            }]
                        }}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: timeBasis
                                    }
                                },
                                y: {
                                    ticks: {
                                        callback: function(value, index, ticks) {
                                            return value + ` ${unit}`;
                                        }
                                    }
                                }
                            }
                        }}
                        height="100%"
                        width="100%"
                    />
                </NewInfoCardContent>)}
            </Item>
        </React.Fragment>
    );
}

SingleValueHistoricalChart.propTypes = {
    cardTittle: PropTypes.string.isRequired,
    isDataAvailable: PropTypes.bool.isRequired,
    labelName: PropTypes.string.isRequired,
    dataList: PropTypes.array.isRequired,
    unit: PropTypes.string.isRequired,
    timeBasis: PropTypes.string.isRequired,
    chartColor: PropTypes.string.isRequired
};

