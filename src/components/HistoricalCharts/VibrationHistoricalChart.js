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


export default function VibrationHistoricalChart(props) {

    const { cardTittle, isVibrationDataAvailable, firstLabelName, secondLabelName, thirdLabelName, vibrationDataList, unit, timeBasis } = props;

    return (
        <React.Fragment>  
            <Item>
                <InfoCardTitle>{cardTittle}</InfoCardTitle>
                {!isVibrationDataAvailable? <CardLoading/> : (
                <NewInfoCardContent marginTop="30px">
                    <Line
                        data={{
                            datasets: [{
                                label: firstLabelName,
                                data: vibrationDataList,
                                parsing: {
                                    yAxisKey: 'x',
                                    xAxisKey: '_id'
                                },
                                backgroundColor: 'red',
                                borderColor: 'red'
                            }, {
                                label: secondLabelName,
                                data: vibrationDataList,
                                parsing: {
                                    yAxisKey: 'y',
                                    xAxisKey: '_id'
                                },
                                backgroundColor: 'blue',
                                borderColor: 'blue'
                            }, {
                                label: thirdLabelName,
                                data: vibrationDataList,
                                parsing: {
                                    yAxisKey: 'z',
                                    xAxisKey: '_id'
                                },
                                backgroundColor: 'green',
                                borderColor: 'green'
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

VibrationHistoricalChart.propTypes = {
    cardTittle: PropTypes.string.isRequired,
    isVibrationDataAvailable: PropTypes.bool.isRequired,
    firstLabelName: PropTypes.string.isRequired,
    secondLabelName: PropTypes.string.isRequired,
    thirdLabelName: PropTypes.string.isRequired,
    vibrationDataList: PropTypes.array.isRequired,
    unit: PropTypes.string.isRequired,
    timeBasis: PropTypes.string.isRequired
};

