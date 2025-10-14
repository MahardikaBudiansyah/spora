<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden</title>
    <style>
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: #f9fafb;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #374151;
        }

        .container {
            text-align: center;
            max-width: 600px;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 5rem;
            font-weight: 800;
            color: #06b6d4;
            margin: 0;
        }

        p {
            margin-top: 1rem;
            font-size: 1.2rem;
            color: #4b5563;
        }

        .actions {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        a,
        button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
        }

        button {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            color: #374151;
        }

        button:hover {
            background: #e5e7eb;
        }

        a {
            background: #06b6d4;
            color: white;
            border: none;
        }

        a:hover {
            background: #0891b2;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>403</h1>
        <p>{{ $message ?? 'Anda tidak memiliki izin untuk mengakses halaman ini.' }}</p>

        <div class="actions">
            <button onclick="history.back()">Kembali</button>
            <a href="{{ \App\Helpers\RouteHelper::getDashboardRouteByRole() }}">Ke Dashboard</a>
        </div>

        <small style="display:block;margin-top:1rem;color:#9ca3af;">
            Hubungi admin jika menurut Anda ini sebuah kesalahan.
        </small>
    </div>
</body>

</html>
