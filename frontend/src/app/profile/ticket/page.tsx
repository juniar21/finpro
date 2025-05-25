// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "@/lib/axios";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { IEvent } from "@/types/type";


// export default function TicketTabs() {
//   const [ticket, setTicket] = useState<IEvent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"upcoming" | "ended">("upcoming");
//   // Pagination States
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const itemsPerPage = 3; // Events per page
//   const session = useSession();

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const res = await axios.get(`/orders/${session.data?.user.id}`, {
//           headers: { Authorization: `Bearer ${session.data?.accessToken}` },
//         });
//         setTicket(res.data.orders);
//         console.log(res.data.orders)
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetch();
//   }, []);

//   if (loading) {
//     return <div className="p-10 text-center">Loading...</div>;
//   }

//   // Sort Upcoming Events by Nearest Date
//   // const upcomingTickets = ticket
//   //   .filter((e) => new Date(e.eventDate).getTime() > Date.now())
//   //   .sort(
//   //     (a, b) =>
//   //       new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
//   //   );

//   // Sort Ended Events by Latest Expired Date
//   // const endedTickets = ticket
//   //   .filter((e) => new Date(e.eventDate).getTime() <= Date.now())
//   //   .sort(
//   //     (a, b) =>
//   //       new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
//   //   );

//   // Pagination
//   // const totalPages =
//   //   activeTab === "upcoming"
//   //     ? Math.ceil(upcomingTickets.length / itemsPerPage)
//   //     : Math.ceil(endedTickets.length / itemsPerPage);

//   // const paginatedTickets =
//   //   activeTab === "upcoming"
//   //     ? upcomingTickets.slice(
//   //         (currentPage - 1) * itemsPerPage,
//   //         currentPage * itemsPerPage
//   //       )
//   //     : endedTickets.slice(
//   //         (currentPage - 1) * itemsPerPage,
//   //         currentPage * itemsPerPage
//   //       );

//   // const handleNextPage = () => {
//   //   if (currentPage < totalPages) {
//   //     setCurrentPage((prev) => prev + 1);
//   //   }
//   // };

//   // const handlePreviousPage = () => {
//   //   if (currentPage > 1) {
//   //     setCurrentPage((prev) => prev - 1);
//   //   }
//   // };

//   return (
//     <div className="p-5 md:p-10">
//       {/* Tab buttons */}
//       <div className="flex border-b mt-12">
//         <button
//           onClick={() => setActiveTab("upcoming")}
//           className={`px-4 py-2 font-semibold ${
//             activeTab === "upcoming"
//               ? "border-b-2 border-orange-600 text-orange-600"
//               : "text-gray-600 hover:text-gray-800"
//           }`}
//         >
//           Upcoming Matches
//         </button>
//         <button
//           onClick={() => setActiveTab("ended")}
//           className={`ml-4 px-4 py-2 font-semibold ${
//             activeTab === "ended"
//               ? "border-b-2 border-orange-600 text-orange-600"
//               : "text-gray-600 hover:text-gray-800"
//           }`}
//         >
//           Ended Matches
//         </button>
//       </div>

//       {/* Upcoming Panel */}
//       <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//         {ticket.length > 0 ? (
//           ticket.map((e) => (
//             <div
//               key={e.id}
//               className="w-auto h-auto rounded-lg shadow-md text-white border border-orange-400 relative"
//             >
//               <h3 className="absolute font-semibold right-0 top-3 px-2 bg-orange-600 rounded-l-md">
//                 {e.category}
//               </h3>
//               {/* <Image
//                 src={e.image}
//                 alt={e.title}
//                 width={300}
//                 height={200}
//                 className="object-cover w-full rounded-t-md mb-2 overflow-hidden"
//               /> */}
//               <h3 className="text-lg font-semibold px-2">{e.title}</h3>
//               <h4 className="text-base font-semibold px-2">{e.venue}</h4>
//               <p className="text-sm text-gray-300 p-2">{e.location}</p>
//               <p className="text-sm text-gray-300 px-2">
//                 {new Date(e.eventDate).toLocaleDateString("en-US", {
//                   weekday: "long",
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </p>
//               <hr className="text-white mx-2 my-2" />
//               <p className="text-sm text-gray-300 px-2">
//                 {e.startTime} - {e.endTime}
//               </p>
//               <p className="text-sm text-gray-300 px-2 mb-5">{e.venue}</p>
//             </div>
//           ))
//         ) : (
//           <div className="text-gray-500 text-center">
//             {activeTab === "upcoming"
//               ? "No upcoming matches."
//               : "No ended matches or create a match—start creating!"}
//           </div>
//         )}
//       </div>
//       {/* Pagination Controls */}
//       <div className="flex justify-center items-center mt-6 space-x-4 text-shadow-md font-semibold">
//         {/* <button
//           disabled={currentPage === 1}
//           onClick={handlePreviousPage}
//           className={`py-2 px-4 rounded ${
//             currentPage === 1
//               ? "bg-gray-600 cursor-not-allowed"
//               : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
//           }`}
//         >
//           Previous
//         </button>
//         <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
//         <button
//           disabled={currentPage === totalPages}
//           onClick={handleNextPage}
//           className={`py-2 px-4 rounded ${
//             currentPage === totalPages
//               ? "bg-gray-600 cursor-not-allowed"
//               : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
//           }`}
//         >
//           Next
//         </button> */}
//       </div>
//     </div>
//   );
// }