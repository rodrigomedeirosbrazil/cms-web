import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br'; 

export default () => {
    const currentTime = moment()

    if (!currentTime || !currentTime.isValid()) { return (<>Olá</>); }

    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const currentHour = parseFloat(currentTime.format('HH'));

    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
        // Between 12 PM and 5PM
        return (<>Boa Tarde</>);
    } else if (currentHour >= splitEvening) {
        // Between 5PM and Midnight
        return (<>Boa noite</>);
    }
    // Between dawn and noon
    return (<>Bom dia</>);
}
