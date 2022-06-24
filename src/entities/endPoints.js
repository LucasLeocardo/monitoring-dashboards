export const BASE_ENDPOINT = process.env.REACT_APP_BASE_ENDPOINT;
export const USERS_LOGIN = '/users/login';
export const USERS_LOGOUT = '/users/logout';
export const GET_USERS = '/users';
export const CREATE_USER = '/user';
export const DELETE_USERS = '/users/deleteByIds';
export const GET_DEVICES = '/devices';
export const DELETE_DEVICES = '/removeDevicesByIds';
export const CREATE_DEVICE = '/devices';
export const GET_ACTIVE_DEVICES = '/activeDevices';
export const GET_DAILLY_VIBRATION_DATA = '/vibrations/getDaillyMeasurementsByDeviceId';
export const GET_DAILLY_TEMPERATURE_DATA = '/temperature/getDaillyMeasurementsByDeviceId';
export const GET_DAILLY_HUMIDITY_DATA = '/humidity/getDaillyMeasurementsByDeviceId';