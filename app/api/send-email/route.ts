import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    // In a real application, you would use a service like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    
    // For now, we'll simulate a successful email send
    // You'll need to set up an email service and add your API keys to .env.local
    
    console.log("📧 New contact form submission:")
    console.log(`From: ${name} (${email})`)
    console.log(`Message: ${message}`)
    
    // TODO: Install resend package and uncomment below
    // npm install resend
    // const { Resend } = require('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // 
    // await resend.emails.send({
    //   from: 'Contact Form <onboarding@resend.dev>',
    //   to: 'vedantagarwal039@gmail.com',
    //   subject: `New Contact: ${name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // })
    
    // For now, logging to console (email functionality ready when resend is installed)
    return NextResponse.json({
      success: true,
      message: "Your message has been received! I'll get back to you soon.",
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 },
    )
  }
}
