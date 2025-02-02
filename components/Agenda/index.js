import React, { useState } from 'react';
import moment from 'moment';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { DAY_FORMAT, TIME_FORMAT, EVENT_TYPE } from '../../constants/events';

import Section from '../../UIComponents/Section';
import UIButtonGroupSelect from '../../UIComponents/Input/UIButtonGroupSelect';
import { UITimeline, UITimelineEvent } from '../../UIComponents/UITimeline';

/* Grabs all events */
const getEventsList = events => {
  if (typeof events !== 'object') {
    return [];
  }
  return events.allIds.map(id => {
    const event = events.byId[id];
    return {
      ...event,
      key: id
    };
  });
};

/* */
const filterEvents = (events, day, type) => {
  if (!Array.isArray(events)) {
    return [];
  }

  return events
    .filter(({ displayInAgenda, time }) =>
      day
        ? moment(time.start, TIME_FORMAT).isSame(
            moment(day, DAY_FORMAT),
            'day'
          ) && displayInAgenda
        : true
    )
    .filter(event => (type !== '' ? event.type === type : true))
    .sort((a, b) =>
      moment(a.time.start, TIME_FORMAT).isBefore(b.time.start, 'minute')
        ? -1
        : 1
    );
};

const formatTime = time => {
  const start = moment(time.start, TIME_FORMAT).format('hh:mm');
  const end = moment(time.end, TIME_FORMAT).format('hh:mma');
  return `${start} - ${end}`;
};

const DayAgenda = ({ label, events }) => {
  if (!events || events.length === 0) {
    return null;
  }
  return (
    <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }}>
      <UITimeline>
        <UITimeline.Title>{label}</UITimeline.Title>
        <UITimeline.Body>
          {events.map(event => (
            <UITimelineEvent key={event.title}>
              <UITimelineEvent.Time>
                {formatTime(event.time)}
              </UITimelineEvent.Time>
              <UITimelineEvent.Body>
                {event.title}
                <br />
                <span style={{ fontWeight: 200 }}>{event.location}</span>
              </UITimelineEvent.Body>
            </UITimelineEvent>
          ))}
        </UITimeline.Body>
      </UITimeline>
    </Col>
  );
};

const Agenda = ({ events }) => {
  const allEvents = getEventsList(events);

  const [selectedType, setSelectedType] = useState('');
  const handleSelect = value => {
    setSelectedType(value);
  };

  return (
    <Section>
      <Section.Header>
        <Section.Title>Agenda</Section.Title>
      </Section.Header>
      <Section.Body>
        <Container>
          <Row className="pb-4">
            <Col className="text-center">
              <UIButtonGroupSelect
                options={[
                  { label: 'All Events', value: '' },
                  { label: 'Conference Events', value: EVENT_TYPE.CONFERENCE },
                  { label: 'Corporate Events', value: EVENT_TYPE.CORPORATE }
                ]}
                onSelect={handleSelect}
              />
            </Col>
          </Row>
          <Row>
            <DayAgenda
              label="Monday Sep 16th"
              events={filterEvents(allEvents, '09-16-2019', selectedType)}
            />
            <DayAgenda
              label="Tuesday Sep 17th"
              events={filterEvents(allEvents, '09-17-2019', selectedType)}
            />
            <DayAgenda
              label="Wednesday Sep 18th"
              events={filterEvents(allEvents, '09-18-2019', selectedType)}
            />
            <DayAgenda
              label="Thursday Sep 19th"
              events={filterEvents(allEvents, '09-19-2019', selectedType)}
            />
            <DayAgenda
              label="Friday Sep 20th"
              events={filterEvents(allEvents, '09-20-2019', selectedType)}
            />
            <DayAgenda
              label="Saturday Sep 20th"
              events={filterEvents(allEvents, '09-21-2019', selectedType)}
            />
          </Row>
        </Container>
      </Section.Body>
    </Section>
  );
};

export default Agenda;
