import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Add the ToastContainer here */}
        <ToastContainer
          position="top-right" // Position of the toast notifications
          autoClose={2000} // Auto close after 2 seconds
          hideProgressBar={false} // Show progress bar
          newestOnTop={false} // Newest notifications appear on top
          closeOnClick // Close toast when clicked
          rtl={false} // Right-to-left layout
          pauseOnFocusLoss // Pause when the window loses focus
          draggable // Allow dragging to dismiss
          pauseOnHover // Pause on hover
        />
      </body>
    </html>
  );
}

