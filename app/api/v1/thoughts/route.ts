import { NextRequest, NextResponse } from "next/server";
import { thoughtSchema } from "@/schema";
import { createClient } from "@/utils/supabase/server";

export const POST = async (req:NextRequest) => {
    try {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) {
            return NextResponse.json({message:"Unauthorized"}, {status: 401})
    
        }
        const body = await req.json();
        console.log(body);
        const {title, thoughts, img} =  thoughtSchema.parse(body);
    
        const {data,error} = await supabase.from("thoughts").insert([
            {
                title,
                thoughts,
                img,
                user_id: user.id
            }
        ]).select().single();
    
        if(error) {
            return NextResponse.json({message:error.message}, {status: 400})
        }
    
        return NextResponse.json(data,{status: 200})
    
    } catch (error) {
        return NextResponse.json({error}, {status: 400})
    }
}

export const GET = async (req:NextRequest) => {
    try {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) {
            return NextResponse.json({message:"Unauthorized"}, {status: 401})
    
        }
        const {data, error} = await supabase.from("thoughts").select().eq("user_id", user.id);
        if(error) {
            return NextResponse.json({message:error.message}, {status: 400})
        }
    
        return NextResponse.json(data,{status: 200})
    
    } catch (error) {
        return NextResponse.json({error}, {status: 400})
    }
}
