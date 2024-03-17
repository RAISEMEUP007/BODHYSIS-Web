import React, { InputHTMLAttributes, forwardRef, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import BasicLayout from '../../common/components/CustomLayout/BasicLayout';
import DailyOrderPanel from './DailyOrderPanel';
import BacklogPanel from './BacklogPanel';
import TruckTripsAll from './TruckTripsAll';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'react-datepicker/dist/react-datepicker.css';
  document.head.appendChild(link);
}

interface Props {
  navigation: any;
}

const Scheduler = ({ navigation }: Props) => {

  const [date, setDate] = useState<Date>(new Date());

  const backloglist = {
    deliveries: [
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
    ],
    swaps: [
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
    ],
    pickups: [
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
      { id: 3, location: 'home location' },
    ]
  }

  const Trucks =  [
      {
        "id": 1,
        "truck": "Truck A",
        "trips": [
          {
            "id": 1,
            "truck_id": 1,
            "selected": true,
            "orderedList": [
              {"id": 1, "index": 1, "truck_id": 1, "driver_id": 101, "reservation_id": 201, "location_id": 301, "location": "Location X", "type": 1},
              {"id": 2, "index": 2, "truck_id": 1, "driver_id": 102, "reservation_id": 202, "location_id": 302, "location": "Location Y", "type": 2},
              {"id": 3, "index": 3, "truck_id": 1, "driver_id": 103, "reservation_id": 203, "location_id": 303, "location": "Location Z", "type": 3},
              {"id": 4, "index": 4, "truck_id": 1, "driver_id": 104, "reservation_id": 204, "location_id": 304, "location": "Location W", "type": 1},
              {"id": 5, "index": 5, "truck_id": 1, "driver_id": 105, "reservation_id": 205, "location_id": 305, "location": "Location P", "type": 2},
              {"id": 6, "index": 6, "truck_id": 1, "driver_id": 106, "reservation_id": 206, "location_id": 306, "location": "Location Q", "type": 2},
            ]
          },
          {
            "id": 1,
            "truck_id": 1,
            "selected": true,
            "orderedList": [
              {"id": 1, "index": 1, "truck_id": 1, "driver_id": 101, "reservation_id": 201, "location_id": 301, "location": "Location X", "type": 1},
              {"id": 2, "index": 2, "truck_id": 1, "driver_id": 102, "reservation_id": 202, "location_id": 302, "location": "Location Y", "type": 2},
              {"id": 3, "index": 3, "truck_id": 1, "driver_id": 103, "reservation_id": 203, "location_id": 303, "location": "Location Z", "type": 3},
              {"id": 4, "index": 4, "truck_id": 1, "driver_id": 104, "reservation_id": 204, "location_id": 304, "location": "Location W", "type": 1},
              {"id": 5, "index": 5, "truck_id": 1, "driver_id": 105, "reservation_id": 205, "location_id": 305, "location": "Location P", "type": 2},
              {"id": 6, "index": 6, "truck_id": 1, "driver_id": 106, "reservation_id": 206, "location_id": 306, "location": "Location Q", "type": 2},
            ]
          },
          {
            "id": 1,
            "truck_id": 1,
            "selected": true,
            "orderedList": [
              {"id": 1, "index": 1, "truck_id": 1, "driver_id": 101, "reservation_id": 201, "location_id": 301, "location": "Location X", "type": 1},
              {"id": 2, "index": 2, "truck_id": 1, "driver_id": 102, "reservation_id": 202, "location_id": 302, "location": "Location Y", "type": 2},
              {"id": 3, "index": 3, "truck_id": 1, "driver_id": 103, "reservation_id": 203, "location_id": 303, "location": "Location Z", "type": 3},
              {"id": 4, "index": 4, "truck_id": 1, "driver_id": 104, "reservation_id": 204, "location_id": 304, "location": "Location W", "type": 1},
              {"id": 5, "index": 5, "truck_id": 1, "driver_id": 105, "reservation_id": 205, "location_id": 305, "location": "Location P", "type": 2},
              {"id": 6, "index": 6, "truck_id": 1, "driver_id": 106, "reservation_id": 206, "location_id": 306, "location": "Location Q", "type": 2},
            ]
          },
          {
            "id": 1,
            "truck_id": 1,
            "selected": true,
            "orderedList": [
              {"id": 1, "index": 1, "truck_id": 1, "driver_id": 101, "reservation_id": 201, "location_id": 301, "location": "Location X", "type": 1},
              {"id": 2, "index": 2, "truck_id": 1, "driver_id": 102, "reservation_id": 202, "location_id": 302, "location": "Location Y", "type": 2},
              {"id": 3, "index": 3, "truck_id": 1, "driver_id": 103, "reservation_id": 203, "location_id": 303, "location": "Location Z", "type": 3},
              {"id": 4, "index": 4, "truck_id": 1, "driver_id": 104, "reservation_id": 204, "location_id": 304, "location": "Location W", "type": 1},
              {"id": 5, "index": 5, "truck_id": 1, "driver_id": 105, "reservation_id": 205, "location_id": 305, "location": "Location P", "type": 2},
              {"id": 6, "index": 6, "truck_id": 1, "driver_id": 106, "reservation_id": 206, "location_id": 306, "location": "Location Q", "type": 2},
            ]
          },
          {
            "id": 1,
            "truck_id": 1,
            "selected": true,
            "orderedList": [
              {"id": 1, "index": 1, "truck_id": 1, "driver_id": 101, "reservation_id": 201, "location_id": 301, "location": "Location X", "type": 1},
              {"id": 2, "index": 2, "truck_id": 1, "driver_id": 102, "reservation_id": 202, "location_id": 302, "location": "Location Y", "type": 2},
              {"id": 3, "index": 3, "truck_id": 1, "driver_id": 103, "reservation_id": 203, "location_id": 303, "location": "Location Z", "type": 3},
              {"id": 4, "index": 4, "truck_id": 1, "driver_id": 104, "reservation_id": 204, "location_id": 304, "location": "Location W", "type": 1},
              {"id": 5, "index": 5, "truck_id": 1, "driver_id": 105, "reservation_id": 205, "location_id": 305, "location": "Location P", "type": 2},
              {"id": 6, "index": 6, "truck_id": 1, "driver_id": 106, "reservation_id": 206, "location_id": 306, "location": "Location Q", "type": 2},
            ]
          },
          {
            "id": 1,
            "truck_id": 1,
            "selected": true,
            "orderedList": [
              {"id": 1, "index": 1, "truck_id": 1, "driver_id": 101, "reservation_id": 201, "location_id": 301, "location": "Location X", "type": 1},
              {"id": 2, "index": 2, "truck_id": 1, "driver_id": 102, "reservation_id": 202, "location_id": 302, "location": "Location Y", "type": 2},
              {"id": 3, "index": 3, "truck_id": 1, "driver_id": 103, "reservation_id": 203, "location_id": 303, "location": "Location Z", "type": 3},
              {"id": 4, "index": 4, "truck_id": 1, "driver_id": 104, "reservation_id": 204, "location_id": 304, "location": "Location W", "type": 1},
              {"id": 5, "index": 5, "truck_id": 1, "driver_id": 105, "reservation_id": 205, "location_id": 305, "location": "Location P", "type": 2},
              {"id": 6, "index": 6, "truck_id": 1, "driver_id": 106, "reservation_id": 206, "location_id": 306, "location": "Location Q", "type": 2},
            ]
          }
        ]
      },
      {
        "id": 2,
        "truck": "Truck B",
        "trips": [
          {
            "id": 2,
            "truck_id": 2,
            "selected": true,
            "orderedList": [
              {"id": 11, "index": 1, "truck_id": 2, "driver_id": 111, "reservation_id": 211, "location_id": 311, "location": "Location V", "type": 1},
              {"id": 12, "index": 2, "truck_id": 2, "driver_id": 112, "reservation_id": 212, "location_id": 312, "location": "Location W", "type": 3},
              {"id": 13, "index": 3, "truck_id": 2, "driver_id": 113, "reservation_id": 213, "location_id": 313, "location": "Location X", "type": 3},
              {"id": 14, "index": 4, "truck_id": 2, "driver_id": 114, "reservation_id": 214, "location_id": 314, "location": "Location Y", "type": 3}
            ]
          },
          {
            "id": 2,
            "truck_id": 2,
            "selected": true,
            "orderedList": [
              {"id": 11, "index": 1, "truck_id": 2, "driver_id": 111, "reservation_id": 211, "location_id": 311, "location": "Location V", "type": 1},
              {"id": 12, "index": 2, "truck_id": 2, "driver_id": 112, "reservation_id": 212, "location_id": 312, "location": "Location W", "type": 3},
              {"id": 13, "index": 3, "truck_id": 2, "driver_id": 113, "reservation_id": 213, "location_id": 313, "location": "Location X", "type": 3},
              {"id": 14, "index": 4, "truck_id": 2, "driver_id": 114, "reservation_id": 214, "location_id": 314, "location": "Location Y", "type": 3}
            ]
          },
          {
            "id": 2,
            "truck_id": 2,
            "selected": true,
            "orderedList": [
              {"id": 11, "index": 1, "truck_id": 2, "driver_id": 111, "reservation_id": 211, "location_id": 311, "location": "Location V", "type": 1},
              {"id": 12, "index": 2, "truck_id": 2, "driver_id": 112, "reservation_id": 212, "location_id": 312, "location": "Location W", "type": 3},
              {"id": 13, "index": 3, "truck_id": 2, "driver_id": 113, "reservation_id": 213, "location_id": 313, "location": "Location X", "type": 3},
              {"id": 14, "index": 4, "truck_id": 2, "driver_id": 114, "reservation_id": 214, "location_id": 314, "location": "Location Y", "type": 3}
            ]
          },
          {
            "id": 2,
            "truck_id": 2,
            "selected": true,
            "orderedList": [
              {"id": 11, "index": 1, "truck_id": 2, "driver_id": 111, "reservation_id": 211, "location_id": 311, "location": "Location V", "type": 1},
              {"id": 12, "index": 2, "truck_id": 2, "driver_id": 112, "reservation_id": 212, "location_id": 312, "location": "Location W", "type": 3},
              {"id": 13, "index": 3, "truck_id": 2, "driver_id": 113, "reservation_id": 213, "location_id": 313, "location": "Location X", "type": 3},
              {"id": 14, "index": 4, "truck_id": 2, "driver_id": 114, "reservation_id": 214, "location_id": 314, "location": "Location Y", "type": 3}
            ]
          },
          {
            "id": 2,
            "truck_id": 2,
            "selected": true,
            "orderedList": [
              {"id": 11, "index": 1, "truck_id": 2, "driver_id": 111, "reservation_id": 211, "location_id": 311, "location": "Location V", "type": 1},
              {"id": 12, "index": 2, "truck_id": 2, "driver_id": 112, "reservation_id": 212, "location_id": 312, "location": "Location W", "type": 3},
              {"id": 13, "index": 3, "truck_id": 2, "driver_id": 113, "reservation_id": 213, "location_id": 313, "location": "Location X", "type": 3},
              {"id": 14, "index": 4, "truck_id": 2, "driver_id": 114, "reservation_id": 214, "location_id": 314, "location": "Location Y", "type": 3}
            ]
          },
          {
            "id": 2,
            "truck_id": 2,
            "selected": true,
            "orderedList": [
              {"id": 11, "index": 1, "truck_id": 2, "driver_id": 111, "reservation_id": 211, "location_id": 311, "location": "Location V", "type": 1},
              {"id": 12, "index": 2, "truck_id": 2, "driver_id": 112, "reservation_id": 212, "location_id": 312, "location": "Location W", "type": 3},
              {"id": 13, "index": 3, "truck_id": 2, "driver_id": 113, "reservation_id": 213, "location_id": 313, "location": "Location X", "type": 3},
              {"id": 14, "index": 4, "truck_id": 2, "driver_id": 114, "reservation_id": 214, "location_id": 314, "location": "Location Y", "type": 3}
            ]
          }
        ]
      },
      {
        "id": 3,
        "truck": "Truck C",
        "trips": [
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          }
        ]
      },
      {
        "id": 3,
        "truck": "Truck C",
        "trips": [
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          }
        ]
      },
      {
        "id": 3,
        "truck": "Truck C",
        "trips": [
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          },
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          }
        ]
      },
      {
        "id": 3,
        "truck": "Truck C",
        "trips": [
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          }
        ]
      },
      {
        "id": 3,
        "truck": "Truck C",
        "trips": [
          {
            "id": 3,
            "truck_id": 3,
            "selected": true,
            "orderedList": [
              {"id": 21, "index": 1, "truck_id": 3, "driver_id": 121, "reservation_id": 221, "location_id": 321, "location": "Location U", "type": 3},
              {"id": 22, "index": 2, "truck_id": 3, "driver_id": 122, "reservation_id": 222, "location_id": 322, "location": "Location V", "type": 1},
              {"id": 23, "index": 3, "truck_id": 3, "driver_id": 123, "reservation_id": 223, "location_id": 323, "location": "Location W", "type": 1},
              {"id": 24, "index": 4, "truck_id": 3, "driver_id": 124, "reservation_id": 224, "location_id": 324, "location": "Location X", "type": 2},
            ]
          }
        ]
      }
    ]

    const CustomInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
      ({ value, onChange, onClick }, ref) => (
        <input
          onClick={onClick}
          onChange={onChange}
          ref={ref}
          style={styles.dateInput}
          value={value}
        ></input>
      )
    );
  
    const renderDatePicker = (selectedDate, onChangeHandler) => {
      return (
        <View style={{zIndex:10}}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => onChangeHandler(date)}
            customInput={<CustomInput />}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            // dropdownMode="select"
            // timeInputLabel="Time:"
            dateFormat="yyyy-MM-dd"
            // showTimeSelect
          />
        </View>
      );
    };

  return (
    <BasicLayout navigation={navigation} screenName={'Scheduler'}>
      <View style={{flex:1, paddingVertical:20, paddingHorizontal:30, justifyContent:'center'}}>
        <View  style={{height:'100%', maxWidth:1600, backgroundColor:'white', padding:24}}>
          {Platform.OS == 'web' && renderDatePicker(date, (date)=>setDate(date))}
          {/* <DailyOrderPanel style={{height:'50%'}}/> */}
          <TruckTripsAll Trucks={Trucks} style={{flex:1, borderWidth: 1, borderColor: '#b3b3b3', marginTop:10}}/>
          <BacklogPanel lists={backloglist} style={{height: 300, paddingTop:20}}/>
        </View>
      </View>
    </BasicLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '90%',
    maxWidth: 1000,
    margin: 'auto',
    marginTop: 40,
  },
  dateInput:{
    borderTopWidth:0,
    borderRightWidth:0,
    borderBottomWidth:1,
    borderLeftWidth:0,
    textAlign: 'center',
    paddingTop:6,
    paddingBottom:4,
    fontSize:16,
    width:100,
    borderColor:'#808080',
  },
});

export default Scheduler;
