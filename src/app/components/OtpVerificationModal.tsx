// import { Card, CardContent } from './Card';
// import Input from './Input';
// import Image from 'next/image';
// import Button from './button';

// // const OtpVerificationModal = function () {
// //     return (
// //         <Card className="w-[480px] shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] rounded-2xl">
// //           <CardContent className="p-8">
// //             <div className="flex flex-col items-center mb-12">
// //               <div className="flex items-center justify-center w-12 h-12 mb-7">
// //                 <Image
// //                   alt="OTP Icon"
// //                   src="/group.png"
// //                   width={46}
// //                   height={46}
// //                 />
// //               </div>
// //               <h2 className="font-[Poppins,Helvetica] text-[#004a7c] text-2xl text-center leading-6 mb-6">
// //                 OTP Verification
// //               </h2>
// //               <p className="font-[Poppins,Helvetica] text-gray-600 text-base text-center leading-4 mb-3">
// //                 We have sent a verification code to
// //               </p>
// //               <p className="font-[Poppins,Helvetica] text-[#004a7c] text-base text-center leading-4">
// //                 ******789
// //               </p>
// //             </div>

// //             <div className="mb-12">
// //               <div className="flex justify-center gap-4 mb-6">
// //                 {[1, 2, 3, 4].map((_, index) => (
// //                   <Input
// //                     key={index}
// //                     className="w-14 h-14 text-center text-xl rounded-lg border-2 border-[#00a9e0]"
// //                     maxLength={1}
// //                   />
// //                 ))}
// //               </div>
// //               <div className="text-center font-[Poppins,Helvetica] text-base leading-4">
// //                 <span className="text-gray-600">Code expires in</span>
// //                 <span className="text-[#004a7c]"> 03:00</span>
// //               </div>
// //             </div>

// //             <div className="flex flex-col items-center">
// //               <Button className="w-full h-14 bg-[#004a7c] rounded-lg mb-6">
// //                 Verify OTP
// //               </Button>
// //               <div className="text-center font-[Poppins,Helvetica] text-base leading-4">
// //                 <span className="text-gray-600">Didnt receive code?</span>
// //                 <button className="text-[#00a9e0] ml-1">Resend OTP</button>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //     )
// // };
            
// // export default OtpVerificationModal;

// // Updated OTP Verification Modal Component
// const OtpVerificationModal = ({ phoneNumber, onClose }) => {
//   const [otp, setOtp] = useState(["", "", "", ""]); // Array to store OTP digits
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle OTP input change
//   const handleOtpChange = (index, value) => {
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus to the next input field
//     if (value && index < otp.length - 1) {
//       const nextInput = document.getElementById(`otp-input-${index + 1}`);
//       if (nextInput) nextInput.focus();
//     }
//   };

//   // Handle OTP verification
//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const fullOtp = otp.join(""); // Combine OTP digits into a single string
//       const userCredential = await window.confirmationResult.confirm(fullOtp);
//       console.log("User signed in successfully:", userCredential.user);

//       alert("Account created successfully!");
//       onClose(); // Close the modal after successful verification
//     } catch (error) {
//       console.error("Error verifying OTP:", error.message);
//       setError("Invalid OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="w-[480px] shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] rounded-2xl">
//       <CardContent className="p-8">
//         <div className="flex flex-col items-center mb-12">
//           <div className="flex items-center justify-center w-12 h-12 mb-7">
//             <Image
//               alt="OTP Icon"
//               src="/group.png"
//               width={46}
//               height={46}
//             />
//           </div>
//           <h2 className="font-[Poppins,Helvetica] text-[#004a7c] text-2xl text-center leading-6 mb-6">
//             OTP Verification
//           </h2>
//           <p className="font-[Poppins,Helvetica] text-gray-600 text-base text-center leading-4 mb-3">
//             We have sent a verification code to
//           </p>
//           <p className="font-[Poppins,Helvetica] text-[#004a7c] text-base text-center leading-4">
//             {`******${phoneNumber.slice(-4)}`}
//           </p>
//         </div>

//         <div className="mb-12">
//           <form onSubmit={handleVerifyOTP}>
//             <div className="flex justify-center gap-4 mb-6">
//               {otp.map((digit, index) => (
//                 <Input
//                   key={index}
//                   id={`otp-input-${index}`}
//                   className="w-14 h-14 text-center text-xl rounded-lg border-2 border-[#00a9e0]"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                 />
//               ))}
//             </div>
//           </form>
//           <div className="text-center font-[Poppins,Helvetica] text-base leading-4">
//             <span className="text-gray-600">Code expires in</span>
//             <span className="text-[#004a7c]"> 03:00</span>
//           </div>
//         </div>

//         <div className="flex flex-col items-center">
//           <Button
//             className="w-full h-14 bg-[#004a7c] rounded-lg mb-6"
//             onClick={handleVerifyOTP}
//             disabled={loading}
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </Button>
//           <div className="text-center font-[Poppins,Helvetica] text-base leading-4">
//             <span className="text-gray-600">Didn't receive code?</span>
//             <button className="text-[#00a9e0] ml-1">Resend OTP</button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
// export default OtpVerificationModal;
