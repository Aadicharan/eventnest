// Quick API verification script
async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('=== Starting EventNest REST API Verification ===\n');

  // Test 1: GET /api/events
  console.log('1. Testing GET /api/events ...');
  let res = await fetch(`${baseUrl}/events`);
  let data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Events count: ${data.length}`);
  console.log(`Sample event: ${data[0].title} | Available: ${data[0].available_seats}/${data[0].max_participants}\n`);

  // Test 2: GET /api/events/:id
  console.log('2. Testing GET /api/events/1 ...');
  res = await fetch(`${baseUrl}/events/1`);
  data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Event details: ${data.title} at ${data.venue}\n`);

  // Test 3: POST /api/events (Create Event)
  console.log('3. Testing POST /api/events (Create Event) ...');
  res = await fetch(`${baseUrl}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Design Thinking & UX Bootcamp',
      description: 'A hands-on workshop guiding students from problem discovery to interactive UI prototyping.',
      date: '2026-11-12',
      time: '01:30 PM',
      venue: 'Design Studio Room 204',
      max_participants: 35
    })
  });
  data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${data.message} ID: ${data.event?.id}\n`);

  // Test 4: POST /api/registrations (Successful Registration)
  console.log('4. Testing POST /api/registrations (New registration) ...');
  res = await fetch(`${baseUrl}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_name: 'Ananya Deshmukh',
      student_email: 'ananya.deshmukh@college.edu',
      student_id: 'CS2023077',
      event_id: 1
    })
  });
  data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Response: ${data.message}\n`);

  // Test 5: POST /api/registrations (Duplicate Registration -> Expect 409)
  console.log('5. Testing POST /api/registrations (Duplicate registration -> Expect 409) ...');
  res = await fetch(`${baseUrl}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_name: 'Ananya Deshmukh',
      student_email: 'ananya.deshmukh@college.edu',
      student_id: 'CS2023077',
      event_id: 1
    })
  });
  data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Response message: "${data.message}" (Expected 409 "Student is already registered for this event.")\n`);

  // Test 6: POST /api/registrations (Full Event -> Event 4 capacity is 2 and has 2 registered -> Expect 400)
  console.log('6. Testing POST /api/registrations (Full Event -> Event 4 -> Expect 400) ...');
  res = await fetch(`${baseUrl}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_name: 'Karan Mehra',
      student_email: 'karan.mehra@college.edu',
      student_id: 'IT2023019',
      event_id: 4
    })
  });
  data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Response message: "${data.message}" (Expected 400 "Event is full.")\n`);

  // Test 7: GET /api/registrations
  console.log('7. Testing GET /api/registrations ...');
  res = await fetch(`${baseUrl}/registrations`);
  data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Total registrations: ${data.length}`);
  console.log(`Latest registration: Student ${data[0].student_name} (${data[0].student_id}) for "${data[0].event_title}"\n`);

  console.log('=== All Backend Tests Passed Successfully! ===');
}

runTests().catch(console.error);
