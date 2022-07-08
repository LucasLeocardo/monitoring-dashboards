import * as React from 'react';
import PropTypes from 'prop-types';
import {
    InfoCardContent,
    InfoCardFooter,
    InfoCardTitle
  } from "../Info-elements/info-elements";
import { styled } from '@mui/material/styles';
import { INDEX_POSITION } from '../../entities/constants'
import Paper from '@mui/material/Paper';
import Thermometer from 'react-thermometer-component';
import { FaTemperatureHigh } from "react-icons/fa";
import NumberIndex from '../Number-index/number-index'

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


export default function GaugeChartTemperature(props) {

    const { cardValue, cardUnit } = props;

    return (
        <React.Fragment>  
            <Item>
                <InfoCardTitle>Temperature</InfoCardTitle>
                <InfoCardContent>
                    <NumberIndex 
                        index={cardUnit} 
                        size={48}
                        indexPosition={INDEX_POSITION.RIGHT_TOP}
                    >
                        {cardValue}
                    </NumberIndex>
                    <Thermometer
                        theme="light"
                        value={cardValue}
                        max="100"
                        steps="1"
                        format="°C"
                        size="normal"
                        height="180"
                    />
                </InfoCardContent>
                <InfoCardFooter>
                    <FaTemperatureHigh color="#c6c6c6" size={35} />
                </InfoCardFooter>
            </Item>
        </React.Fragment>
    );
}

GaugeChartTemperature.propTypes = {
    cardValue: PropTypes.number.isRequired,
    cardUnit: PropTypes.string.isRequired
};

