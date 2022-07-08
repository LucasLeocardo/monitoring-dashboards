import * as React from 'react';
import PropTypes from 'prop-types';
import {
    InfoCardContent,
    InfoCardFooter,
    InfoCardTitle
  } from "../Info-elements/info-elements";
import ReactSpeedometer from "react-d3-speedometer";
import { SiSpeedtest } from "react-icons/si";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
const { Index } = require("../../components/Number-index/number-index.styles");

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


export default function GaugeChartLinearAcceleration(props) {

    const { cardTitle, cardValue, cardUnit } = props;

    return (
        <React.Fragment>  
            <Item>
                <InfoCardTitle>{cardTitle}</InfoCardTitle>
                <InfoCardContent marginTop="30px">
                    <ReactSpeedometer
                        maxValue={20}
                        minValue={-20}
                        height={190}
                        width={290}
                        value={cardValue}
                        needleTransition="easeQuadIn"
                        needleTransitionDuration={1000}
                        needleColor="red"
                        startColor="green"
                        segments={10}
                        endColor="blue"
                    />
                </InfoCardContent>
                <InfoCardFooter>
                    <SiSpeedtest color="#c6c6c6" size={35} />
                    <Index
                        style={{
                        fontSize: 24,
                        justifyContent: "center"
                        }}
                    >
                        {cardUnit}
                    </Index>
                </InfoCardFooter>
            </Item>
        </React.Fragment>
    );
}

GaugeChartLinearAcceleration.propTypes = {
    cardTitle: PropTypes.string.isRequired,
    cardValue: PropTypes.number.isRequired,
    cardUnit: PropTypes.string.isRequired
};

