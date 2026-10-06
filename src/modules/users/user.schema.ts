import {z} from "zod";

export const updateProfileSchema = z.object({

name: z.string()
.trim()
.min(2, "Name must be at least 2 characters")
.max(50, "Name must be at most 50 characters")
.optional(),


phone: z.string()
.trim()
.min(7, "Number must be at least 7 characters")
.max(20, "Number must be at most 20 characters")
.optional(),


address: z.string()
.trim()
.min(10, "address must be at least 10 characters")
.max(150, "address must be at most 150 characters")
.optional(),


city: z.string()
.trim()
.min(5, "city Name must be at least 5 characters")
.max(50, "city Name must be at most 50 characters")
.optional(),


country: z.string()
.trim()
.min(5, "country name must be at least 5 characters")
.max(50, "country name must be at most 50 characters")
.optional(),
 
linkedinUrl:  z.string()
.trim()
.url("Invalid URL")
.optional(),
 
githubUrl:  z.string()
.trim()
.url("Invalid URL")
.optional(),

bio:  z.string()
.trim()
.min(5, "bio must be at least 5 characters")
.max(500, "bio must be at most 500 characters")
.optional(),
 
})

