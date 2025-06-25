import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EventForm from '../EventForm'
import { apiGetEvent, apiUpdateEvent } from '@/services/EventService'
import useSWR, { mutate } from 'swr'
import { useParams, useNavigate } from 'react-router'
import { TbTrash } from 'react-icons/tb'
import type { EventFormType } from '../EventForm/validation/eventFormSchema'
import type { EventWithDetailsAndCount } from '@/@types/events'
import { AxiosError } from 'axios'
import { PiClockCountdown } from 'react-icons/pi'
import { FaLink, FaRegCopy } from 'react-icons/fa'

const EventEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR<EventWithDetailsAndCount>(
        id ? `/event/${id}` : null,
        () => apiGetEvent(Number(id)),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: EventFormType) => {
        try {
            setIsSubmiting(true)
            const payload = {
                event_name: values.event_name,
                event_description: values.event_description,
                status: values.status,
                event_type: values.event_type,
                live_venue_address: values.live_venue_address,
                live_video_url: values.live_video_url,
                asset_id: values.asset_id,
                instructions: values.instructions,
                landing_page_url: values.landing_page_url,
                success_url: values.success_url,
                calendar_url: values.calendar_url,
                membership_plans: values.membership_plans.map((plan) => ({
                    name: plan.name,
                    date:
                        typeof plan.date === 'object' &&
                        plan.date instanceof Date
                            ? Math.floor(plan.date.getTime() / 1000)
                            : Math.floor(plan.date / 1000),
                    payment_type: plan.payment_type,
                    cost: plan.isFree ? 0 : plan.cost,
                    isFree: plan.isFree,
                })),
            }

            await apiUpdateEvent(Number(id), payload)

            toast.push(
                <Notification type="success">
                    Event updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate(`/event/${id}`)
            navigate('/concepts/event/event-list')
        } catch (error) {
            console.error('Error updating event:', error)
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">
                Your event was deleted successfully!
            </Notification>,
            {
                placement: 'top-center',
            },
        )
        navigate('/concepts/event/event-list')
    }

    const handleDelete = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    const EventFormProps = useMemo(() => {
        const membershipPlans = (data?.memberships || []).map((plan) => {
            const isFree = plan.price === 0
            return {
                name: plan.name || '',
                isFree,
                cost: isFree ? 0 : plan.price || 0,
                date: plan.dates?.[0]?.date
                    ? new Date(Number(plan.dates[0].date) * 1000)
                    : new Date(),
                payment_type: plan.payment_type || 'one_off',
            }
        })

        const defaultValues: EventFormType = {
            event_name: data?.event_name || '',
            event_description: data?.event_description || '',
            status:
                (data?.status as 'active' | 'suspended' | 'cancelled') ||
                'active',
            event_type: data?.event_type || 'live_venue',
            live_venue_address: data?.live_venue_address || '',
            live_video_url: data?.live_video_url || '',
            asset_id: data?.asset_id || 0,
            instructions: data?.instructions || '',
            landing_page_url: data?.landing_page_url || '',
            success_url: data?.success_url || '',
            calendar_url: data?.calendar_url || '',
            membership_plans:
                membershipPlans.length > 0
                    ? membershipPlans
                    : [
                          {
                              name: '',
                              isFree: false,
                              cost: 0,
                              date: new Date(),
                              payment_type: 'one_off',
                          },
                      ],
            terms: true,
            course_url_external: '',
            course_internal: false,
            invite_existing_leads: false,
        }

        return {
            defaultValues,
        }
    }, [data])

    const handleCopy = () => {
        let form = `<form action="https://api.3themind.com/v1/lead/external-form" method="post" id="lead_form" name="lead_form" class="lead_form">
  <!------------>
  <label class="textbig">SIGNUP HERE</label>
  <select name="membership_id" id="membership_id" class="lead_form_select" required>
    <option value="" disabled selected>Select a date</option>
    <option value="2025-07-03">July 3, 2025</option>
    <!-- Add more dates as needed -->
  </select>
  <input class="lead_form_name" maxlength="256" name="name" placeholder="Name" type="text" id="lead_form_name" required>
  <!------------>
  <input class="lead_form_email" maxlength="256" name="email" placeholder="@" type="email" id="lead_form_email" required>
  <!------------>
  <input class="lead_form_phone" maxlength="256" name="phone" placeholder="Phone" type="text" id="lead_form_phone" required>
  <!------------>
  <div class="capcon" id="captcha_container">
    <label class="textsmall" id="">Security Question</label>
    <label class="textmed" id="captcha_question"></label>
    <input class="lead_form_name answerbox" type="text" id="captcha_answer" name="captcha_answer" placeholder="Answer" required />
  </div>
  <!------------>
  <input type="hidden" name="event_id" value="YOUR_EVENT_ID">
  <input type="hidden" name="host_id" value="YOUR_HOST_ID">
  <input type="hidden" name="redirect_url" value="YOUR_REDIRECT_URL">
  <!------------>
  <div id="lead_form_error" class="lead_form_error" style="display:none;"></div>
  <!------------>
  <input type="submit" id="lead_form_submit" class="lead_form_submit" value="Register">
  <!------------>
</form>
<style>
  .lead_form {
    width: 100%;
    max-width: 100%;
    min-height: 100%;
    Padding: 30px 30px;
    border-radius: 5px;
    background-color: #efefef;
    margin: 10px;
    border: 1px solid #cccccc;
    align-content: left;
  }

  .lead_form_name,
  .lead_form_email,
  .lead_form_phone {
    border: 1px solid #222;
    background-color: #fff0;
    border-radius: 5px;
    height: 45px;
    margin-bottom: 10px;
    padding: 8px 12px;
    transition: all .5s;
    width: 100%;
    font-size: 16px;
    background-color: #ffffff;
  }

  .textbig {
    font-size: 18px;
    font-weight: Medium;
    text-align: Left;
    Margin-bottom: 15px;
  }

  .textsmall {
    font-size: 10px;
    font-weight: normal;
    margin: 7px 0px -2px 0px;
  }

  .textmed {
    font-size: 15px;
    font-weight: normal;
  }

  .answerbox {
    margin: 7px 0px 7px 0px;
  }

  .capcon {
    text-align: left;
  }

  .lead_form_error {
    color: red;
    background-color: #fff0f0;
    border-radius: 5px;
    padding: 12px 12px;
    border-style: none;
    height: auto;
    font-weight: 400;
    display: block;
    margin-bottom: 20px;
    font-size: 16px;
  }

  .lead_form_submit {
    background-color: #222;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    height: 4vh;
    padding-top: 7px;
    padding-bottom: 7px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    width: 100%;
    height: 45px;
    margin: 5px 0px 5px 0px;
  }

  .lead_form_select {
    border: 0.5px solid #222;
    background-color: #ffffff;
    border-radius: 5px;
    height: 45px;
    margin-bottom: 10px;
    padding: 8px 12px;
    transition: all 0.5s;
    width: 100%;
    font-size: 16px;
    font-family: inherit;
    /* optional: match font with inputs */
  }

  .lead_form_dates {
    border: 1px solid #222;
    background-color: #fff0;
    border-radius: 3px;
    height: 45px;
    margin-bottom: 20px;
    padding: 8px 12px;
    transition: all .5s;
    width: 100%;
    font-size: 16px;
    background-color: #ffffff;
  }

  input[type=text],
  input[type=email],
  .lead_form_dates {
    border: .5px solid #222;
  }

  input:focus,
  .lead_form_dates {
    border: .5px solid #222;
    outline: none;
  }
</style>
<script src="https://cdn.jsdelivr.net/gh/brian-kiplagat/yeebli-js-code@latest/j.js"></script>`
        const host_id = data?.host_id?.toString() || ''
        const success_url = data?.success_url || data?.live_video_url

        if (!id || !host_id || !success_url) {
            console.log({ id, host_id, success_url })
            toast.push(
                <Notification type="danger">
                    Ops! we could not generate the form. Event ID, Host ID, and
                    Success URL are required! Please refresh the page and try
                    again.
                </Notification>,
            )
            return
        }
        form = form.replace('YOUR_EVENT_ID', id || '')
        form = form.replace('YOUR_HOST_ID', host_id)
        form = form.replace('YOUR_REDIRECT_URL', success_url)

        navigator.clipboard.writeText(form)
        toast.push(
            <Notification type="success">
                Your form has been copied to the clipboard!
            </Notification>,
            { placement: 'top-center' },
        )
    }

    const handleLink = () => {
        const link = `https://elevnt.io/stream/${data?.id}`
        navigator.clipboard.writeText(link)
        toast.push(
            <Notification type="success">
                Your event link has been copied to clipboard!
            </Notification>,
            { placement: 'top-center' },
        )
    }
    const handleCountdown = () => {
        let form = `<script>
// Set the date we're counting down to, the time in PST
const countDownDate = new Date("COMPLETE_DATE");
// Update the count down every 1 second
const x = setInterval(function () {
  // Get today's date and time
  const now = new Date().getTime();

  // Find the distance between now and the count down date
  const distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds and use minimumInteger to make sure all elements have 2 digits
  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  ).toLocaleString(undefined, { minimumIntegerDigits: 2 });
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  ).toLocaleString(undefined, { minimumIntegerDigits: 2 });
  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  ).toLocaleString(undefined, { minimumIntegerDigits: 2 });
  const seconds = Math.floor(
    (distance % (1000 * 60)) / 1000
  ).toLocaleString(undefined, { minimumIntegerDigits: 2 });

  // Display the result in the elements with id="days", id="hours", id="minutes", and id = "seconds"

  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;

  // If the count down is finished, remove the countdown element and copy, remove a combo class to reveal launch message
  if (distance < 0) {
    clearInterval(x);
    const itsTime = document.getElementById("itshere");
    const timeWrapper = document.getElementById("gone");
    timeWrapper.remove();
    itsTime.classList.remove("itshere");
  }
}, 500);
</script>
`
        form = form.replace(
            'COMPLETE_DATE',
            data?.memberships?.[0]?.dates?.[0]?.date || '',
        )
        navigator.clipboard.writeText(form)
        toast.push(
            <Notification type="success">
                Your countdown script has been copied to clipboard!
            </Notification>,
            { placement: 'top-center' },
        )
    }

    return (
        <Loading loading={isLoading}>
            <EventForm onFormSubmit={handleFormSubmit} {...EventFormProps}>
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span>
                            <div className="flex-wrap inline-flex xl:flex items-center gap-2 ml-2">
                                <Button
                                    type="button"
                                    icon={<FaRegCopy />}
                                    onClick={handleCopy}
                                />
                                <Button
                                    type="button"
                                    icon={<FaLink />}
                                    onClick={handleLink}
                                />
                                <Button
                                    type="button"
                                    icon={<PiClockCountdown />}
                                    onClick={handleCountdown}
                                />
                            </div>
                        </span>
                        <div className="flex items-center mr-2">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'bEvent-error ring-1 ring-error text-error hover:bEvent-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </Container>
            </EventForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want delete this? This action can&apos;t be
                    undo.{' '}
                </p>
            </ConfirmDialog>
        </Loading>
    )
}

export default EventEdit
