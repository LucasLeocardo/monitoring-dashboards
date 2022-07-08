import * as React from 'react';
import PropTypes from 'prop-types';
import {
    InfoCardContent,
    InfoCardFooter,
    InfoCardTitle
  } from "../Info-elements/info-elements";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import VerticalInfoMeter from '../Vertical-info-meter/vertical-info-meter';
import NumberIndex from '../Number-index/number-index'
import { BsFillCloudLightningRainFill } from "react-icons/bs";
const { Index } = require("../Number-index/number-index.styles");

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


export default function GaugeChartRainFallLevel(props) {

    const { cardValue, cardUnit } = props;

    return (
        <React.Fragment>  
            <Item>
                <InfoCardTitle>Rainfall level</InfoCardTitle>
                <InfoCardContent>
                    <NumberIndex index={cardUnit} size={48}>
                    {cardValue}
                    </NumberIndex>
                    <VerticalInfoMeter value={cardValue} correctionFactor={3} />
                </InfoCardContent>
                <InfoCardFooter>
                    <BsFillCloudLightningRainFill color="#c6c6c6" size={35} />
                </InfoCardFooter>
            </Item>
        </React.Fragment>
    );
}

GaugeChartRainFallLevel.propTypes = {
    cardValue: PropTypes.number.isRequired,
    cardUnit: PropTypes.string.isRequired
};

