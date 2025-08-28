<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ $page['props']['title'] ?? 'Ingkenefutsal Web Magelang' }}</title>

    <link rel="icon" href="/assets/images/ingkenefutsal-icon.png" type="image/png" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />


    {{-- <!-- FullCalendar CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.7/main.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.7/main.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid@6.1.7/main.min.css" rel="stylesheet">

    <link rel="stylesheet" href="/css/fullcalendar/core/index.global.min.js" />
    <link rel="stylesheet" href="/css/fullcalendar/daygrid/index.global.min.js" />
    <link rel="stylesheet" href="/css/fullcalendar/timegrid/index.global.min.js" /> --}}


    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
