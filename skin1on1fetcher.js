
import fetch from 'node-fetch'

main();

async function main() {
    const arr = new Array(8887).fill(0);
    
    

    const el1on1 = []
    await Promise.all(arr.map(async (el, index) => {
        try {
            const data = await fetch(`https://antonymnft.s3.us-west-1.amazonaws.com/json/${index}`)
            const jsonRes = await data.json()
            const att = jsonRes.attributes.map(att => {
                return att.value
            }).find(v => v == '1/1')
            if(att) el1on1.push(index+1)
        } catch(e) {

        }
        
    }))
    console.log(el1on1)
    console.log(el1on1.length)
    
    
}