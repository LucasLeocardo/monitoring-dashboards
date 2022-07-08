import * as React from 'react';
import PropTypes from 'prop-types';
import {
    InfoCardContent,
    InfoCardFooter,
    InfoCardTitle
  } from "../Info-elements/info-elements";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Chart } from "react-google-charts";
import { WiBarometer } from "react-icons/wi";
const { Index } = require("../../components/Number-index/number-index.styles");

const styles = {
    dial: {
      width: `auto`,
      height: `auto`,
      color: "#000",
      border: "0.5px solid #fff",
      padding: "2px"
    },
    title: {
      fontSize: "1em",
      color: "#000"
    }
  };

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


export default function GaugeChartPressure(props) {

    const { cardValue, cardUnit } = props;

    return (
        <React.Fragment>  
            <Item>
                <InfoCardTitle>Poro Pressure</InfoCardTitle>
                <InfoCardContent>
                    <div style={styles.dial}>
                        <Chart
                            height={180}
                            chartType="Gauge"
                            loader={<div></div>}
                            data={[
                            ["Label", "Value"],
                            ["Meter", Number(cardValue)]
                            ]}
                            options={{
                            redFrom: 90,
                            redTo: 200,
                            yellowFrom: 50,
                            yellowTo: 90,
                            minorTicks: 5,
                            min: -200,
                            max: 200
                            }}
                        />
                    </div>
                </InfoCardContent>
                <InfoCardFooter>
                    <WiBarometer color="#c6c6c6" size={60} />
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

GaugeChartPressure.propTypes = {
    cardValue: PropTypes.number.isRequired,
    cardUnit: PropTypes.string.isRequired
};

