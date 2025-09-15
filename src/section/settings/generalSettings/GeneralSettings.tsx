// "use client";

// import React from "react";

// const GeneralSettings = () => {
//     return (
//         <h1>General settings</h1>
//     )
// }

// export default GeneralSettings;

"use client";
// import React, { useState, useCallback } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// type TimeRange = { start: Date; end: Date };
// type DateWithSlots = { date: string; slots: TimeRange[] };

// // Detect user timezone
// const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// // Format date as YYYY-MM-DD in local timezone
// const formatDate = (d: Date) =>
//   d.toLocaleDateString("en-CA", { timeZone: userTimeZone });

// // Merge date and time in local TZ
// const mergeDateTime = (date: Date, time: Date) => {
//   const merged = new Date(date);
//   merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
//   return merged;
// };

// const SlotPicker: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [startTime, setStartTime] = useState<Date | null>(null);
//   const [endTime, setEndTime] = useState<Date | null>(null);
//   const [dateSlots, setDateSlots] = useState<DateWithSlots | null>(null);

//   // Check duplicate slot
//   const isDuplicateSlot = (slots: TimeRange[], s: Date, e: Date) =>
//     slots.some(
//       (slot) =>
//         slot.start.getTime() === s.getTime() &&
//         slot.end.getTime() === e.getTime()
//     );

//   // Add slot
//   const addSlot = useCallback(
//     (start: Date, end: Date) => {
//       if (!selectedDate) return;
//       if (end <= start) return;

//       const diff = (end.getTime() - start.getTime()) / (1000 * 60);
//       if (diff < 15) return;

//       const dateKey = formatDate(selectedDate);
//       setDateSlots((prev) => {
//         const slots = prev?.date === dateKey ? [...prev.slots] : [];
//         if (isDuplicateSlot(slots, start, end)) return prev;
//         return { date: dateKey, slots: [...slots, { start, end }] };
//       });

//       setStartTime(null);
//       setEndTime(null);
//     },
//     [selectedDate]
//   );

//   // Handle date change
//   const handleDateChange = (date: Date | null) => {
//     if (!date) return;
//     setSelectedDate(date);
//     const dateKey = formatDate(date);
//     setDateSlots((prev) =>
//       prev?.date === dateKey ? prev : { date: dateKey, slots: [] }
//     );
//     setStartTime(null);
//     setEndTime(null);
//   };

//   const handleStartTime = (time: Date | null) => {
//     if (time && selectedDate) {
//       setStartTime(mergeDateTime(selectedDate, time));
//     } else {
//       setStartTime(time);
//     }
//   };

//   const handleEndTime = (time: Date | null) => {
//     if (time && startTime && selectedDate) {
//       const mergedEnd = mergeDateTime(selectedDate, time);
//       addSlot(startTime, mergedEnd);
//       setEndTime(mergedEnd);
//     } else {
//       setEndTime(time);
//     }
//   };

//   const handleRemoveSlot = (index: number) => {
//     setDateSlots((prev) =>
//       prev
//         ? { ...prev, slots: prev.slots.filter((_, i) => i !== index) }
//         : prev
//     );
//   };

//   // Compute min selectable time in current TZ
//   const getMinSelectableTime = () => {
//     if (selectedDate && formatDate(selectedDate) === formatDate(new Date())) {
//       const now = new Date();
//       const minutes = Math.ceil(now.getMinutes() / 15) * 15;
//       now.setMinutes(minutes, 0, 0);
//       return now;
//     }
//     return new Date(0, 0, 0, 0, 0); // midnight for other days
//   };

//   const minSelectableTime = getMinSelectableTime();

//   // Disable times already covered by selected slots or in the past
//   const isTimeDisabled = (time: Date) => {
//     if (!selectedDate) return false;
//     const checkTime = mergeDateTime(selectedDate, time);

//     // block past times if today
//     if (formatDate(selectedDate) === formatDate(new Date())) {
//       if (checkTime < new Date()) return true;
//     }

//     // block overlapping slots
//     if (dateSlots && dateSlots.date === formatDate(selectedDate)) {
//       return dateSlots.slots.some(
//         (slot) => checkTime >= slot.start && checkTime < slot.end
//       );
//     }

//     return false;
//   };

//   return (
//     <div className="p-4 space-y-4 text-white">
//       <h2 className="font-bold">Time Zone: {userTimeZone}</h2>

//       {/* Date Picker */}
//       <div>
//         <h2 className="font-bold">Select Date</h2>
//         <DatePicker
//           selected={selectedDate}
//           onChange={handleDateChange}
//           dateFormat="yyyy-MM-dd"
//           placeholderText="Pick a date"
//           minDate={new Date()}
//           shouldCloseOnSelect
//         />
//       </div>

//       {/* Time Picker */}
//       {selectedDate && (
//         <div>
//           <h2 className="font-bold">Select Time Range</h2>
//           <div className="flex space-x-4 items-center">
//             <DatePicker
//               selected={startTime}
//               onChange={handleStartTime}
//               showTimeSelect
//               showTimeSelectOnly
//               minTime={minSelectableTime}
//               maxTime={new Date(0, 0, 0, 23, 45)}
//               timeIntervals={15}
//               dateFormat="h:mm aa"
//               placeholderText="Start Time"
//               shouldCloseOnSelect
//               excludeTimes={Array.from({ length: 24 * 4 }, (_, i) => {
//                 const t = new Date(0, 0, 0, 0, 0);
//                 t.setMinutes(i * 15);
//                 return t;
//               }).filter(isTimeDisabled)}
//             />
//             <span>to</span>
//             <DatePicker
//               selected={endTime}
//               onChange={handleEndTime}
//               showTimeSelect
//               showTimeSelectOnly
//               minTime={startTime || minSelectableTime}
//               maxTime={new Date(0, 0, 0, 23, 59)}
//               timeIntervals={15}
//               dateFormat="h:mm aa"
//               placeholderText="End Time"
//               shouldCloseOnSelect
//               excludeTimes={Array.from({ length: 24 * 4 }, (_, i) => {
//                 const t = new Date(0, 0, 0, 0, 0);
//                 t.setMinutes(i * 15);
//                 return t;
//               }).filter(isTimeDisabled)}
//             />
//           </div>
//         </div>
//       )}

//       {/* Slots */}
//       {dateSlots && (
//         <div>
//           <h2 className="font-bold">Selected Slots for {dateSlots.date}</h2>
//           <ul>
//             {dateSlots.slots.map((s, i) => (
//               <li key={i} className="flex items-center space-x-2">
//                 <span>
//                   {s.start.toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     timeZone: userTimeZone,
//                   })}{" "}
//                   -{" "}
//                   {s.end.toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     timeZone: userTimeZone,
//                   })}
//                 </span>
//                 <button
//                   onClick={() => handleRemoveSlot(i)}
//                   className="text-red-500"
//                 >
//                   ❌
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SlotPicker;


// import React, { useCallback, useState, useEffect } from 'react';
// import { Dialog, DialogTitle, IconButton, Button } from '@mui/material';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// interface TimeSlot {
//   start: Date;
//   end: Date;
// }

// interface DateSlot {
//   date: string;
//   slots: TimeSlot[];
// }

// const SlotScheduler = () => {
//   const [open, setOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [startTime, setStartTime] = useState<Date | null>(null);
//   const [endTime, setEndTime] = useState<Date | null>(null);
//   const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);
//   const [userTimeZone, setUserTimeZone] = useState<string>(() => {
//     return Intl.DateTimeFormat().resolvedOptions().timeZone;
//   });

//   // Detect user timezone
//   useEffect(() => {
//     const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     setUserTimeZone(tz);
//   }, []);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setSelectedDate(null);
//     setStartTime(null);
//     setEndTime(null);
//     setOpen(false);
//   };

//   const addTimeSlot = () => {
//     if (!selectedDate || !startTime || !endTime) return;

//     const dateStr = selectedDate.toISOString().split('T')[0];
//     const newSlot: TimeSlot = { start: startTime, end: endTime };

//     setDateSlots((prev) => {
//       const existingDate = prev.find((d) => d.date === dateStr);
//       if (existingDate) {
//         return prev.map((d) =>
//           d.date === dateStr ? { ...d, slots: [...d.slots, newSlot] } : d
//         );
//       } else {
//         return [...prev, { date: dateStr, slots: [newSlot] }];
//       }
//     });

//     // Reset fields
//     setStartTime(null);
//     setEndTime(null);
//   };

//   const handleRemoveSlot = (dateIndex: number, slotIndex: number) => {
//     setDateSlots((prev) =>
//       prev.map((d, i) =>
//         i === dateIndex
//           ? { ...d, slots: d.slots.filter((_, j) => j !== slotIndex) }
//           : d
//       )
//     );
//   };

//   return (
//     <div className="p-4 space-y-4 text-white bg-gray-800 rounded shadow">
//       <span
//         className="cursor-pointer text-2xl"
//         onClick={handleOpen}
//         title="Open Slot Scheduler"
//       >
//         📅
//       </span>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="sm"
//         sx={{ '& .MuiDialog-paper': { padding: '20px' } }}
//       >
//         <DialogTitle className="flex justify-between items-center">
//           Set Backup Account
//           <IconButton onClick={handleClose}>❌</IconButton>
//         </DialogTitle>

//         <div className="space-y-4">
//           <h2 className="font-bold">Select Date</h2>
//           <DatePicker
//             selected={selectedDate}
//             onChange={(date) => setSelectedDate(date)}
//             dateFormat="yyyy-MM-dd"
//             placeholderText="Pick a date"
//             minDate={new Date()}
//           />

//           {selectedDate && (
//             <div className="space-y-4">
//               <h2 className="font-bold">Select Time Range</h2>
//               <div className="flex space-x-4 items-center">
//                 <DatePicker
//                   selected={startTime}
//                   onChange={(date) => setStartTime(date)}
//                   showTimeSelect
//                   showTimeSelectOnly
//                   timeIntervals={15}
//                   dateFormat="h:mm aa"
//                   placeholderText="Start Time"
//                   minTime={new Date(0, 0, 0, 0, 0)}
//                   maxTime={new Date(0, 0, 0, 23, 45)}
//                 />
//                 <span>to</span>
//                 <DatePicker
//                   selected={endTime}
//                   onChange={(date) => setEndTime(date)}
//                   showTimeSelect
//                   showTimeSelectOnly
//                   timeIntervals={15}
//                   dateFormat="h:mm aa"
//                   placeholderText="End Time"
//                   minTime={startTime || new Date(0, 0, 0, 0, 0)}
//                   maxTime={new Date(0, 0, 0, 23, 59)}
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={addTimeSlot}
//                   disabled={!selectedDate || !startTime || !endTime}
//                 >
//                   Add Time Slot
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Display selected date slots */}
//         {dateSlots.length > 0 && (
//           <div className="space-y-4 mt-4">
//             {dateSlots.map((ds, dateIdx) => (
//               <div key={dateIdx} className="bg-gray-700 p-2 rounded">
//                 <h3 className="font-bold">{ds.date}</h3>
//                 <ul className="space-y-2">
//                   {ds.slots.map((slot, slotIdx) => (
//                     <li
//                       key={slotIdx}
//                       className="flex justify-between items-center"
//                     >
//                       <span>
//                         {slot.start.toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                           timeZone: userTimeZone,
//                         })}{' '}
//                         -{' '}
//                         {slot.end.toLocaleTimeString([], {
//                           hour: '2-digit',
//                           minute: '2-digit',
//                           timeZone: userTimeZone,
//                         })}
//                       </span>
//                       <button
//                         className="text-red-500"
//                         onClick={() => handleRemoveSlot(dateIdx, slotIdx)}
//                       >
//                         ❌
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         )}
//       </Dialog>
//     </div>
//   );
// };

// export default SlotScheduler;

import React, { useState } from 'react';
import { Dialog, DialogTitle, IconButton, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TimeSlot {
  start: Date;
  end: Date;
}

interface DateSlot {
  date: string;
  slots: TimeSlot[];
}

const SlotScheduler = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);

  // Local timezone automatically
  const [userTimeZone] = useState<string>(() => 
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedDate(null);
    setStartTime(null);
    setEndTime(null);
    setOpen(false);
  };

  const addTimeSlot = () => {
    if (!selectedDate || !startTime || !endTime) return;

    const now = new Date();

    // Combine selectedDate with startTime and endTime
    const startDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
      0,
      0
    );

    const endDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      0,
      0
    );

    // Prevent adding past or invalid slots
    if (startDateTime <= now || endDateTime <= now || endDateTime <= startDateTime) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const newSlot: TimeSlot = { start: startDateTime, end: endDateTime };

    setDateSlots((prev) => {
      const existingDate = prev.find((d) => d.date === dateStr);
      if (existingDate) {
        return prev.map((d) =>
          d.date === dateStr ? { ...d, slots: [...d.slots, newSlot] } : d
        );
      } else {
        return [...prev, { date: dateStr, slots: [newSlot] }];
      }
    });

    setStartTime(null);
    setEndTime(null);
  };

  const handleRemoveSlot = (dateIndex: number, slotIndex: number) => {
    setDateSlots((prev) =>
      prev.map((d, i) =>
        i === dateIndex
          ? { ...d, slots: d.slots.filter((_, j) => j !== slotIndex) }
          : d
      )
    );
  };

  const getMinStartTime = () => {
    const now = new Date();
    if (selectedDate && selectedDate.toDateString() === now.toDateString()) {
      return now;
    }
    return new Date(0, 0, 0, 0, 0);
  };

  const getMinEndTime = () => {
    return startTime
      ? new Date(startTime.getTime() + 15 * 60 * 1000)
      : new Date(0, 0, 0, 0, 15);
  };

  return (
    <div className="p-4 space-y-4 text-white bg-gray-800 rounded shadow">
      <span
        className="cursor-pointer text-2xl"
        onClick={handleOpen}
        title="Open Slot Scheduler"
      >
        📅
      </span>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        sx={{ '& .MuiDialog-paper': {  width:'100%', height:'500px', zIndex:9999999, marginTop:'10rem'} }}
      >
        <div className="flex p-4 items-center justify-between w-full border-b border-gray-300 mb-4">
          <div>Add time slots</div>
          <div className="cursor-pointer" onClick={handleClose}>X</div>
        </div>
        <div className="flex items-center gap-2  p-4">
          <div className=''>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Pick a date"
              minDate={new Date()}
              className='w-[100%] focus:outline-none focus:border-none focus:shadow-none'
              popperPlacement="bottom-end"
            />
          </div>
          <div className=''>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              placeholderText="Start Time"
              minTime={getMinStartTime()}
              maxTime={new Date(0, 0, 0, 23, 45)}
              className='w-[100%] focus:outline-none focus:border-none focus:shadow-none'
            />
          </div>
          <div className=''>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              placeholderText="End Time"
              minTime={getMinEndTime()}
              maxTime={new Date(0, 0, 0, 23, 59)}
              className='w-[100%] focus:outline-none focus:border-none focus:shadow-none'
            />
          </div>
          <div className=''>
            <Button
              variant="contained"
              color="primary"
              onClick={addTimeSlot}
              disabled={!selectedDate || !startTime || !endTime}
              className='w-[100%]'
            >
              ➕
            </Button>
          </div>
        </div>

        {dateSlots.length > 0 && (
          <div className="space-y-4 mt-4 p-4">
            {dateSlots.map((ds, dateIdx) => (
              <div key={dateIdx} className="bg-gray-700 p-2 rounded">
                <h3 className="font-bold">{ds.date}</h3>
                <ul className="space-y-2">
                  {ds.slots.map((slot, slotIdx) => (
                    <li
                      key={slotIdx}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {slot.start.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: userTimeZone,
                        })}{' '}
                        -{' '}
                        {slot.end.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: userTimeZone,
                        })}
                      </span>
                      <button
                        className="text-red-500"
                        onClick={() => handleRemoveSlot(dateIdx, slotIdx)}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default SlotScheduler;




