import { useState } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useNavigate } from 'react-router'
import { apiCreateLeadBulk } from '@/services/LeadsService'
import { useAuth } from '@/auth'
import { AxiosError } from 'axios'
import { Button, Upload } from '@/components/ui'
import { FcDocument } from 'react-icons/fc'
import BulkLeadTable from './BulkLeadTable'
import { HiOutlineInboxIn } from 'react-icons/hi'
import { ParsedLead } from '@/@types/lead'



const LeadBulkCreate = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [parsedLeads, setParsedLeads] = useState<ParsedLead[]>([])

  
   

   
 

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    const handleParsing = (files: File[]) => {
        if (files.length === 0) return
        
        const file = files[0]
        if (!file.name.toLowerCase().endsWith('.csv')) {
            toast.push(
                <Notification type="danger">
                    Please upload a CSV file
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const csv = e.target?.result as string
            const lines = csv.split('\n').filter(line => line.trim())
            
            if (lines.length < 2) {
                toast.push(
                    <Notification type="danger">
                        CSV file must have at least a header and one data row
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }

            const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
            const data = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim())
                return {
                    name: values[0] || '',
                    email: values[1] || '',
                    phone: values[2] || ''
                }
            })

            setParsedLeads(data)
            toast.push(
                <Notification type="success">
                    Successfully parsed {data.length} leads from CSV
                </Notification>,
                { placement: 'top-center' }
            )
        }
        reader.readAsText(file)
    }

    const handleFileRemove = () => {
        setParsedLeads([])
    }

    const handleImport = async () => {
        try {
            // Make API call
            await apiCreateLeadBulk(parsedLeads)
            toast.push(
                <Notification type="success">
                    Lead created successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/concepts/lead/lead-list')
        } catch (error) {
            console.error('Error creating lead:', error)
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
            throw error
        }
    }

    return (
        <>
            <div>
            
            <div>
                <Upload  draggable uploadLimit={1} onChange={handleParsing} onFileRemove={handleFileRemove}>
                    <div className="my-16 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <FcDocument />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Drop your csv file here, or{' '}
                            </span>
                            <span className="text-blue-500">browse</span>
                        </p>
                        <p className="mt-1 opacity-60 dark:text-white">
                            Supported file types: csv
                        </p>
                    </div>
                </Upload>
             </div>
             {parsedLeads.length > 0 && (
                 <div className="flex justify-between gap-4">
                     <Button className="mb-5 w-full" loading={isSubmiting}  icon={<HiOutlineInboxIn /> }
                onClick={handleImport} >
                         Import
                     </Button>
                    
                 </div>
             )}
             <BulkLeadTable data={parsedLeads} />
        </div>
           
        </>
    )
}

export default LeadBulkCreate
